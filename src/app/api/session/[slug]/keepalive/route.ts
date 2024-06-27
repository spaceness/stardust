import { auth } from "@/lib/auth";
import { db, session } from "@/lib/drizzle/db";
import { getSession } from "@/lib/session/get-session";
import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
export async function POST(_req: NextRequest, { params }: { params: { slug: string } }) {
	const userSession = await auth();
	const { id } = (await getSession(params.slug, userSession)) || {};
	const date = new Date();
	date.setDate(date.getDate() + 7);
	if (!id) {
		return Response.json({ error: "Not Found" }, { status: 404 });
	}
	try {
		await db.update(session).set({ expiresAt: date.getTime() }).where(eq(session.id, id));
		return Response.json({ success: true });
	} catch (e) {
		console.error("Error: %e", e);
		return Response.json({ error: "Error" }, { status: 500 });
	}
}
