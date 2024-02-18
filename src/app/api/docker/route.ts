import Dockerode from "dockerode";
import { NextRequest } from "next/server";
const docker = new Dockerode({
  port: 2375,
  protocol: "http",
  host: "10.53.19.10",
});

let containerId: string;
export async function GET(req: NextRequest) {
  const { id } = await req.json();
  const container = docker.getContainer(id);
  const data = await container.inspect();
  return Response.json({ data });
}
export async function PUT(req: NextRequest) {
  const protocol = process?.env.SSL === "true" ? "https" : "http";
  const config = await fetch(
    `${protocol}://${req.headers.get("host")}/api/config`,
  )
    .then((res) => res.json())
    .then((data) => data.config);
  const configImages: Image[] = await config.images;
  const { image } = await req.json();
  if (!configImages.find((img) => img.dockerImage === image)) {
    return Response.json(
      { error: "Image not allowed", success: false },
      { status: 400 },
    );
  } else {
    await docker.pull(image, (err: any, stream: NodeJS.ReadableStream) => {
      if (err) {
        return Response.json({ error: err, success: false }, { status: 500 });
      }
      docker.modem.followProgress(stream, onFinished);
      async function onFinished() {
        const container = await docker.createContainer({
          Image: image,
          name: Date.now() + "-" + image.split("/")[2],
          HostConfig: {
            PortBindings: {
              "3000/tcp": [{ HostPort: "3000" }],
            },
          },
        });
        container.start();
        containerId = container.id;
      }
    });
    return Response.json({ id: containerId, success: true }, { status: 201 });
  }
}
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const container = docker.getContainer(id);
  try {
    await container.stop();
    await container.remove();
    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    return Response.json({ error: error, success: false }, { status: 500 });
  }
}
export async function PATCH(req: NextRequest) {
  const { id, action } = await req.json();
  const container = docker.getContainer(id);
  try {
    if (action === "pause") {
      await container.pause();
    } else if (action === "unpause") {
      await container.unpause();
    } else if (action === "start") {
      await container.start();
    } else if (action === "stop") {
      await container.stop();
    }
    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    return Response.json({ error: error, success: false }, { status: 500 });
  }
}
