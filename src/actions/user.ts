"use server";

import { auth } from "@/lib/auth";
import { getConfig } from "@/lib/config";
import { db, session, user } from "@/lib/drizzle/db";
import { deleteSession } from "@/lib/session";
import { hash } from "argon2";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
// only for admin things!!!!
async function throwErrorIfitsCurrentUser(userId: string) {
	const userSession = await auth();
	if (userSession?.user.id === userId) {
		throw new Error("Cannot change this option of the current user");
	}
}
export async function deleteUser(userId: string, triggeredByUser = false) {
	if (!triggeredByUser) {
		const userSession = await auth();
		if (userSession?.user.id === userId) {
			throw new Error("Cannot delete the current user through admin");
		}
	}
	const sessions = await db.select().from(session).where(eq(session.userId, userId));
	await Promise.all(sessions.map((session) => deleteSession(session.id))).catch(() => {});
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
	await throwErrorIfitsCurrentUser(userId);
	const [update] = await db.update(user).set({ isAdmin }).where(eq(user.id, userId)).returning();
	revalidatePath("/admin/users");
	return { success: true, admin: update.isAdmin };
}

export async function resetUserPassword(userId: string, data: FormData) {
	await throwErrorIfitsCurrentUser(userId);
	if (getConfig().auth.huDb) throw new Error("Cannot reset password for HU");
	await db
		.update(user)
		.set({
			password: await hash(data.get("new-password")?.toString() as string),
		})
		.where(eq(user.id, userId));
	return { success: true };
}
