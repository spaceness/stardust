"use server";
import authConfig from "@/lib/auth.config";
import { deleteSession as deleteSessionBase } from "@/lib/util/session";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
export async function deleteSession(id: string) {
	const userSession = await getServerSession(authConfig);
	if (!userSession || !userSession.user) return;
	await deleteSessionBase(id, userSession);
	revalidatePath("/");
	redirect("/");
}
