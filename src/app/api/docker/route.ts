import Docker from "dockerode";
const docker = new Docker({
  host: process.env.DOCKER_IP || "10.53.19.10",
  port: process.env.DOCKER_PORT || 2375,
  version: "v1.25",
});
export async function GET() {
  const containers = await docker.listContainers({ all: true });
  return Response.json({ containers });
}