"use server";

import { auth } from "@/lib/auth";
import { db, session, user } from "@/lib/drizzle/db";
import { deleteSession } from "@/lib/session";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function deleteUser(userId: string) {
	const userSession = await auth();
	const { sessions, currentUser } = await db.transaction(async (tx) => {
		const sessions = await tx.select().from(session).where(eq(session.userId, userId));
		const currentUser = await tx.query.user.findFirst({
			where: (users, { eq }) => and(eq(users.email, userSession?.user?.email as string), eq(user.id, userId)),
		});
		return { sessions, currentUser };
	});
	if (currentUser?.isAdmin) {
		throw new Error("Cannot delete the current user");
	}
	await Promise.all(sessions.map((session) => deleteSession(session.id)));
	await db.delete(user).where(eq(user.id, userId));
	revalidatePath("/admin/users");
	return { success: true };
}
export async function deleteUserSessions(userId: string) {
	const sessions = await db.select().from(session).where(eq(session.userId, userId));
	await Promise.all(sessions.map((session) => deleteSession(session.id)));
	revalidatePath("/admin/users");

	return { success: true };
}
export async function changeUserAdminStatus(userId: string, isAdmin: boolean) {
	const userSession = await auth();
	const currentUser = await db.query.user.findFirst({
		where: (users, { eq }) => and(eq(users.email, userSession?.user?.email as string), eq(user.id, userId)),
	});
	if (currentUser?.isAdmin) {
		throw new Error("Cannot change the admin status of the current user");
	}
	const [update] = await db.update(user).set({ isAdmin }).where(eq(user.id, userId)).returning();
	revalidatePath("/admin/users");
	return { success: true, admin: update.isAdmin };
}
