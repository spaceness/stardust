import docker from "@/lib/docker";
import { db, session, user } from "@/lib/drizzle/db";
import { and, eq } from "drizzle-orm";
import type { Session } from "next-auth";
import { getConfig } from "../config";
/**
 *
 * @param containerId The id of the container to get
 * @param userSession An Auth.js `Session` object
 * @returns The database query for the session along with the container IP, or `null` if it doesn't exist.
 */
async function getSession(containerId: string, userSession: Session | null) {
	const [containerSession] = await db.transaction(async (tx) => {
		return tx
			.select()
			.from(session)
			.where(and(eq(session.id, containerId), eq(session.userId, userSession?.user.id as string)));
	});
	if (!containerSession) return null;
	const ip = (await docker.getContainer(containerId).inspect()).NetworkSettings.Networks[getConfig().docker.network]
		.IPAddress;
	return {
		ip,
		...containerSession,
	};
}

export { getSession };
