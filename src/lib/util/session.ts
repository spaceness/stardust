import docker from "@/lib/docker";
import { db, session, user } from "@/lib/drizzle/db";
import type Dockerode from "dockerode";
import { eq } from "drizzle-orm";
import type { Session } from "next-auth";
import { getSession } from "./get-session";
const getRandomNumber = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
async function createSession(Image: string, userSession: Session) {
	console.log(`Creating session with image ${Image}`);
	try {
		if (!userSession || !userSession.user) throw new Error("User not found");
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
				name: `session-${Date.now()}-${userSession.user.email?.split("@")[0]}`,
				Image,
				HostConfig: {
					PortBindings: {
						"5901/tcp": [{ hostIp: "127.0.0.1" }, { HostPort: vncPort.toString() }],
						"6080/tcp": [{ hostIp: "127.0.0.1" }, { HostPort: agentPort.toString() }],
					},
				},
			})
			.catch((error) => {
				throw new Error(`Container·not·created:${error}`);
			});
		await container.start().catch(() => {
			container.remove({ force: true });
			throw new Error("Container not started");
		});
		const { userId } = (
			await db
				.select({
					userId: user.id,
				})
				.from(user)
				.where(eq(user.email, userSession.user.email as string))
		)[0];
		return await db
			.insert(session)
			.values({
				id: container.id,
				dockerImage: Image,
				userId,
				vncPort,
				agentPort,
				createdAt: Date.now(),
				expiresAt: Date.now() + 1000 * 60 * 60 * 24,
			})
			.returning();
	} catch (error) {
		console.error(error);
	}
}
async function manageSession(containerId: string, action: keyof Dockerode.Container, userSession: Session) {
	if (!userSession || !userSession.user) throw new Error("User not found");
	const { id } = (await getSession(containerId, userSession)) || {};
	if (!id) throw new Error("Session not found");
	try {
		const container = docker.getContainer(id);
		await container[action]();
	} catch (error) {
		console.error(error);
	}
}
async function deleteSession(containerId: string, userSession: Session) {
	if (!userSession || !userSession.user) throw new Error("User not found");
	const { id } = (await getSession(containerId, userSession)) || {};
	if (!id) throw new Error("Session not found");
	try {
		const container = docker.getContainer(id);
		await container.remove({ force: true });
		await db.delete(session).where(eq(session.id, id));
	} catch (error) {
		console.error(error);
	}
}
export { createSession, deleteSession, manageSession };
