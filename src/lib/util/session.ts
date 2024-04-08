import docker from "@/lib/docker";
import { db } from "@/lib/drizzle/db";
import { session, user } from "@/lib/drizzle/schema";
import { Session } from "next-auth";
import { eq } from "drizzle-orm";
async function createSession(Image: string, userSession: Session) {
	console.log(`Creating session with image ${Image}`);
	try {
		if (!userSession || !userSession.user) throw new Error("User not found");
		if (!process.env.DOCKER_PORT_RANGE)
			throw new Error("Docker port range not set");
		const portsRange = process.env.DOCKER_PORT_RANGE.split("-").map(Number);
		let vncPort: number =
			Math.floor(Math.random() * (portsRange[1] - portsRange[0] + 1)) +
			portsRange[0];
		const portInUse = await docker
			.listContainers({ all: true })
			.then((containers) =>
				containers
					.map((container) => container.Ports?.map((port) => port.PublicPort))
					.flat(),
			);
		while (portInUse.includes(vncPort)) {
			vncPort =
				Math.floor(Math.random() * (portsRange[1] - portsRange[0] + 1)) +
				portsRange[0];
		}
		await docker.pull(Image).catch(console.error);
		const container = await docker
			.createContainer({
				name: `session-${Date.now()}-${userSession.user.email?.split("@")[0]}`,
				Image,
				HostConfig: {
					PortBindings: {
						"5901/tcp": [
							{ hostIp: "0.0.0.0" },
							{ HostPort: vncPort.toString() },
						],
					},
				},
			})
			.catch(console.error);
		if (!container) throw new Error("Container not created");
		await container.start();
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
				// @ts-expect-error shut for now
				vncPort: vncPort,
				userId,
				dockerImage: Image,
				createdAt: Date.now(),
				expiresAt: Date.now() + 1000 * 60 * 60 * 24,
				id: container.id,
			})
			.returning();
	} catch (error) {
		console.error(error);
	}
}
export { createSession };
