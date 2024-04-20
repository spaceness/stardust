"use server";
import authConfig from "@/lib/auth.config";
import { deleteSession as deleteSessionBase, manageSession as manageSessionBase } from "@/lib/util/session";
import type Dockerode from "dockerode";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
async function deleteSession(id: string) {
	const userSession = await getServerSession(authConfig);
	if (!userSession || !userSession.user) return;
	await deleteSessionBase(id, userSession);
	revalidatePath("/");
	redirect("/");
}
async function manageSession(id: string, action: keyof Dockerode.Container, navigate: boolean = true) {
	const userSession = await getServerSession(authConfig);
	if (!userSession || !userSession.user) return;
	await manageSessionBase(id, action, userSession);
	revalidatePath("/");
	if (navigate) redirect("/");
}
export { deleteSession, manageSession };
