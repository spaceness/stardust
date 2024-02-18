import { promises as fs } from "fs";
export const dynamic = "force-dynamic";
export async function GET() {
  const file = await fs.readFile(process.cwd() + "/config.json", "utf8");
  const config = JSON.parse(file);
  return Response.json({ config }, { status: 200 });
}
