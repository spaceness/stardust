import { db, session, user } from "@/lib/drizzle/db";
import { and, eq } from "drizzle-orm";
import type { Session } from "next-auth";
/**
 *
 * @param containerId The id of the container to get
 * @param userSession An Auth.js `Session` object
 * @returns The database query for the session, or `null` if it doesn't exist.
 */
async function getSession(containerId: string, userSession: Session) {
	if (!userSession.user) throw new Error("User not found");
	const [{ userId }] = await db
		.select({
			userId: user.id,
		})
		.from(user)
		.where(eq(user.email, userSession.user.email as string));
	const [containerSession] = await db
		.select()
		.from(session)
		.where(and(eq(session.id, containerId), eq(session.userId, userId)));
	if (!containerSession) return null;
	return containerSession;
}

export { getSession };
