"use server";
import crypto from "node:crypto";
import docker from "@/lib/docker";
import { db, session, user } from "@/lib/drizzle/db";
import { consola } from "consola";
import type Dockerode from "dockerode";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "../auth";
import { getSession } from "./get-session";
/**
 * Creates a new Stardust session
 * @param Image Docker image to use for making the session
 */
async function createSession(Image: string) {
  consola.info(`✨ Stardust: Creating session with image ${Image}`);
  try {
    const userSession = await auth();
    if (!userSession?.user) throw new Error("User not found");
    const id = `stardust-${crypto.randomUUID()}-${Image.split("/")[2]}`;
    const container = await docker.createContainer({
      name: id,
      Image,
      HostConfig: {
        ShmSize: 1024,
        NetworkMode: process.env.DOCKER_NETWORK,
      },
    });
    await container.start().catch((e) => {
      container.remove({ force: true });
      throw new Error(`Container not started ${e.message}`);
    });
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return db
      .transaction(async (tx) => {
        return await tx
          .insert(session)
          .values({
            id: container.id,
            dockerImage: Image,
            createdAt: Date.now(),
            expiresAt: date.getTime(),
            userId: (
              await tx
                .select({
                  userId: user.id,
                })
                .from(user)
                .where(eq(user.email, userSession.user?.email as string))
            )[0].userId,
          })
          .returning();
      })
      .catch(async (e) => {
        await container.remove({ force: true });
        throw new Error(e.message);
      });
  } catch (error) {
    console.error(error);
  }
}
/**
 * Allows you to manage a Stardust session with dockerode
 * @param containerId The id of the container to manage
 * @param action The action to do on the container
 * @param admin If this is triggered by an admin
 */
async function manageSession(containerId: string, action: keyof Dockerode.Container, admin?: boolean) {
  const userSession = await auth();
  const [{ isAdmin }] = await db
    .select({ isAdmin: user.isAdmin })
    .from(user)
    .where(eq(user.email, userSession?.user?.email as string));
  const { id } = (await getSession(containerId, userSession)) || {};
  if ((admin && isAdmin) || id) {
    const container = docker.getContainer(id || containerId);
    await container[action]();
  }
}
/**
 * Deletes a Stardust session
 * @param containerId The id of the container to delete
 * @param admin If this is triggered by an admin
 */
async function deleteSession(containerId: string, admin?: boolean) {
  const userSession = await auth();
  const [{ isAdmin }] = await db
    .select({ isAdmin: user.isAdmin })
    .from(user)
    .where(eq(user.email, userSession?.user?.email as string));
  const { id } = (await getSession(containerId, userSession)) || {};
  if ((admin && isAdmin) || id) {
    const container = docker.getContainer(id || containerId);
    await container.remove({ force: true });
    await db.delete(session).where(eq(session.id, id || containerId));
    revalidatePath("/");
  }
}
export { createSession, deleteSession, manageSession };
