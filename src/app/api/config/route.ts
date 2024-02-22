import { promises as fs } from "fs";
export const dynamic = "force-dynamic";
export async function GET() {
	return Response.json(
		JSON.parse(
			await fs.readFile(process.cwd() + "/" + process.env.CONFIG_PATH, "utf8"),
		),
		{ status: 200 },
	);
}
