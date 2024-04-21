import { getAuthSession } from "@/lib/auth"
import { db, session } from "@/lib/drizzle/db"
import { getSession } from "@/lib/util/get-session"
import { eq } from "drizzle-orm"
import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"
import type { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
	const { imagePreview, containerId } = await req.json()
	const userSession = await getAuthSession()
	if (!userSession) {
		return Response.json({ error: "Unauthorized" }, { status: 401 })
	}
	const containerSession = await getSession(containerId, userSession)
	if (!containerSession) {
		return Response.json({ error: "Not Found" }, { status: 404 })
	}
	await db
		.update(session)
		.set({ imagePreview })
		.where(eq(session.id, containerSession.id))
		.catch((e) => {
			console.error("Update failed: %e", e)
			return Response.json({ error: "Update failed" }, { status: 500 })
		})
	revalidatePath("/")
	return Response.json({ success: true })
}
