import authConfig from "@/lib/auth.config";
import { db, session } from "@/lib/drizzle/db";
import { getSession } from "@/lib/util/get-session";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
	const { imagePreview, containerId } = await req.json();
	const userSession = await getServerSession(authConfig);
	if (!userSession) {
		return Response.json({ error: "Unauthorized" }, { status: 401 });
	}
	const containerSession = await getSession(containerId, userSession);
	if (!containerSession) {
		return Response.json({ error: "Unauthorized" }, { status: 401 });
	}
	await db
		.update(session)
		.set({ imagePreview })
		.where(eq(session.id, containerId))
		.catch(() => {
			console.error("Update failed");
			return Response.json({ error: "Update failed" }, { status: 500 });
		});
	revalidatePath("/")
	return Response.json({ success: true });
}
