import { db, session, user } from "@/lib/drizzle/db";
import { and, eq } from "drizzle-orm";
import { Session } from "next-auth";

async function getSession(containerId: string, userSession: Session) {
	if (!userSession || !userSession.user) throw new Error("User not found");
	const { userId } = (
		await db
			.select({
				userId: user.id,
			})
			.from(user)
			.where(eq(user.email, userSession.user.email as string))
	)[0];
	const containerSession = (
		await db
			.select()
			.from(session)
			.where(and(eq(session.id, containerId), eq(session.userId, userId)))
	)[0];
	if (!containerSession) return null;
	return containerSession;
}

export { getSession };
