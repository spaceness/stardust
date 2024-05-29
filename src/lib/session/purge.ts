import docker from "@/lib/docker";
import { db, session } from "@/lib/drizzle/db";
import { consola } from "consola";
import { eq, lte } from "drizzle-orm";

setInterval(async () => {
	consola.info("✨ Stardust: Purging stale sessions");
	await db.transaction(async (tx) => {
		const staleSessions = await tx.select().from(session).where(lte(session.expiresAt, Date.now()));
		await Promise.all(
			staleSessions.map(async (s) => {
				const container = docker.getContainer(s.id);
				const network = (await container.inspect()).HostConfig.NetworkMode;
				await container.remove({ force: true });
				await docker.getNetwork(network as string).remove({ force: true });
				await tx.delete(session).where(eq(session.id, s.id));
			}),
		);
	});
}, 30000);
