import { db, session } from "@/lib/drizzle/db";
import { lte, eq } from "drizzle-orm";
import docker from "@/lib/docker";

setInterval(async () => {
	console.log("✨ Stardust INFO: Purging stale sessions");
	const staleSessions = await db.select().from(session).where(lte(session.expiresAt, Date.now()));
	await Promise.all(
		staleSessions.map(async (s) => {
			const container = docker.getContainer(s.id);
			await container.remove({ force: true });
			await db.delete(session).where(eq(session.id, s.id));
		}),
	);
}, 30000);
