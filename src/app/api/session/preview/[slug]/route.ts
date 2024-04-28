import { getAuthSession } from "@/lib/auth";
import type { NextRequest } from "next/server";
import { getSession } from "@/lib/util/get-session";
import { sessionRunning } from "@/lib/util/session-running";
export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
	const userSession = await getAuthSession();
	if (!userSession) {
		return Response.json({ error: "Unauthorized" }, { status: 401 });
	}
	const containerSession = await getSession(params.slug, userSession);
	if (!containerSession) {
		return Response.json({ error: "Not Found" }, { status: 404 });
	}
	await sessionRunning(containerSession.agentPort);
	const image = await fetch(`http://${process.env.CONTAINER_HOST}:${containerSession.agentPort}/screenshot`).then(
		(res) => res.blob(),
	);
	return new Response(image, {
		headers: {
			"Content-Type": "image/png",
		},
	});
}
