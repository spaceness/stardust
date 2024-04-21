"use server"
import { getAuthSession } from "@/lib/auth"
import { deleteSession as deleteSessionBase, manageSession as manageSessionBase } from "@/lib/util/session"
import type Dockerode from "dockerode"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
async function deleteSession(id: string) {
	const userSession = await getAuthSession()
	if (!userSession || !userSession.user) return
	await deleteSessionBase(id, userSession)
	revalidatePath("/")
	redirect("/")
}
async function manageSession(id: string, action: keyof Dockerode.Container, navigate = true) {
	const userSession = await getAuthSession()
	if (!userSession || !userSession.user) return
	await manageSessionBase(id, action, userSession)
	revalidatePath("/")
	if (navigate) redirect("/")
}
export { deleteSession, manageSession }
