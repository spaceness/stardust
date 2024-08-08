import docker from "@/lib/docker";
import { db, session } from "@/lib/drizzle/db";
import { and, eq } from "drizzle-orm";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
	const [userId, containerId] = req.headers.get("authorization")?.split(":") || [];
	if (!containerId || !userId) {
		return new Response("Unauthorized - values missing", { status: 401 });
	}
	if (req.nextUrl.hostname !== "localhost") {
		return new Response("Unauthorized - IP does not match", { status: 401 });
	}
	const [{ Id }] = (await docker.listContainers()).filter((container) => container.Id.startsWith(containerId));
	const [dbEntry] = await db
		.select()
		.from(session)
		.where(and(eq(session.id, Id), eq(session.userId, userId)));
	if (!dbEntry) {
		return new Response("Not found", { status: 404 });
	}
	return new Response("OK", { status: 200 });
}
