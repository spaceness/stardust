"use server";
import docker from "@/lib/docker";
import { db, session, user } from "@/lib/drizzle/db";
import { consola } from "consola";
import type Dockerode from "dockerode";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "../auth";
import { getSession } from "./get-session";
const getRandomNumber = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
/**
 * Creates a new Stardust session
 * @param Image Docker image to use for making the session
 */
async function createSession(Image: string) {
	consola.info(`✨ Stardust: Creating session with image ${Image}`);
	try {
		const userSession = await auth();
		if (!userSession?.user) throw new Error("User not found");
		if (!process.env.DOCKER_PORT_RANGE) throw new Error("Docker port range not set");
		const portsRange = process.env.DOCKER_PORT_RANGE.split("-").map(Number);
		let vncPort: number = getRandomNumber(portsRange[0], portsRange[1]);
		let agentPort: number = getRandomNumber(portsRange[0], portsRange[1]);
		const portInUse = await docker
			.listContainers({ all: true })
			.then((containers) => containers.flatMap((container) => container.Ports?.map((port) => port.PublicPort)));
		while (portInUse.includes(vncPort)) {
			vncPort = getRandomNumber(portsRange[0], portsRange[1]);
		}
		while (portInUse.includes(agentPort)) {
			agentPort = getRandomNumber(portsRange[0], portsRange[1]);
		}
		const container = await docker
			.createContainer({
				name: `stardust-${Date.now()}-${userSession.user.email?.split("@")[0]}`,
				Image,
				HostConfig: {
					PortBindings: {
						"5901/tcp": [{ hostIp: "127.0.0.1" }, { HostPort: vncPort.toString() }],
						"6080/tcp": [{ hostIp: "127.0.0.1" }, { HostPort: agentPort.toString() }],
					},
					ShmSize: 1024,
				},
			})
			.catch((error) => {
				throw new Error(`Container not created:${error}`);
			});
		await container.start().catch(() => {
			container.remove({ force: true });
			throw new Error("Container not started");
		});
		const date = new Date();
		date.setDate(date.getDate() + 7);
		return db.transaction(async (tx) => {
			return await tx
				.insert(session)
				.values({
					vncPort,
					agentPort,
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
	if (admin) {
		const [{ isAdmin }] = await db
			.select({ isAdmin: user.isAdmin })
			.from(user)
			.where(eq(user.email, userSession?.user?.email as string));
		if (isAdmin) {
			const container = docker.getContainer(containerId);
			await container[action]();
			revalidatePath("/");
		}
		return;
	}
	const { id } = (await getSession(containerId, userSession)) || {};
	if (!id) throw new Error("Session not found");
	try {
		const container = docker.getContainer(id);
		await container[action]();
		revalidatePath("/");
	} catch (error) {
		console.error(error);
	}
}
/**
 * Deletes a Stardust session
 * @param containerId The id of the container to delete
 * @param admin If this is triggered by an admin
 */
async function deleteSession(containerId: string, admin?: boolean) {
	const userSession = await auth();
	if (admin) {
		const [{ isAdmin }] = await db
			.select({ isAdmin: user.isAdmin })
			.from(user)
			.where(eq(user.email, userSession?.user?.email as string));
		if (isAdmin) {
			const container = docker.getContainer(containerId);
			await container.remove({ force: true });
			await db.delete(session).where(eq(session.id, containerId));
			revalidatePath("/");
		}
		return;
	}
	const { id } = (await getSession(containerId, userSession)) || {};
	if (!id) throw new Error("Session not found");
	try {
		const container = docker.getContainer(id);
		await container.remove({ force: true });
		await db.delete(session).where(eq(session.id, id));
		revalidatePath("/");
	} catch (error) {
		console.error(error);
	}
}
export { createSession, deleteSession, manageSession };
