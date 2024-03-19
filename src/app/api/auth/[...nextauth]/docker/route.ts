import type Dockerode from "dockerode";
import docker from "@/lib/docker";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

async function checkRequest(container: string): Promise<boolean> {
	const containerImage = (await docker.getContainer(container).inspect()).Config
		.Image;
	const images = await prisma.image.findMany({
		select: {
			dockerImage: true,
		},
	});
	const check = images.find((image) => image.dockerImage === containerImage);
	return !!check;
}
export async function POST(req: NextRequest) {
	const { id } = await req.json();
	try {
		const container = docker.getContainer(id);
		const data = await container.inspect();
		const check = await checkRequest(id);
		if (!check) {
			return Response.json(
				{
					error:
						"Container data can't be fetched since it's not allowed, or it's not a real container",
					success: false,
				},
				{ status: 400 },
			);
		}
		return Response.json(data, { status: 200 });
	} catch (error) {
		return Response.json({ error: error }, { status: 500 });
	}
}

export async function PUT(req: NextRequest) {
	const configImages = await prisma.image.findMany({
		select: {
			dockerImage: true,
		},
	});
	const { image } = await req.json();
	const check = configImages.find((img) => img.dockerImage === image);
	if (!check) {
		return Response.json(
			{ error: "bro thought he could use any docker image", success: false },
			{ status: 400 },
		);
	} else {
		try {
			const containerId = await new Promise((resolve, reject) => {
				docker.pull(image, (err: any, stream: NodeJS.ReadableStream) => {
					if (err) {
						return reject(err);
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
						await container.start();
						resolve(container.id);
					}
				});
			});
			return Response.json({ id: containerId, success: true }, { status: 201 });
		} catch (e) {
			return Response.json(
				{ error: e as any, success: false },
				{ status: 500 },
			);
		}
	}
}
export async function DELETE(req: NextRequest) {
	const { id } = await req.json();
	const container = docker.getContainer(id);
	const check = await checkRequest(id);
	if (!check) {
		return Response.json(
			{ error: "Action not allowed; nice try", success: false },
			{ status: 400 },
		);
	}
	try {
		await container.remove();
		return Response.json({ success: true }, { status: 200 });
	} catch (error) {
		return Response.json({ error: error, success: false }, { status: 500 });
	}
}
export async function PATCH(req: NextRequest) {
	const { id, action }: { id: string; action: keyof Dockerode.Container } =
		await req.json();
	const container = docker.getContainer(id);
	const check = await checkRequest(id);
	if (!check) {
		return Response.json(
			{ error: "Action not allowed; nice try", success: false },
			{ status: 400 },
		);
	}
	try {
		const allowedActions: Array<keyof Dockerode.Container> = [
			"pause",
			"unpause",
			"start",
			"stop",
			"restart",
			"kill",
		];
		if (!allowedActions.includes(action)) {
			throw new Error("Action is not valid or allowed");
		}
		await container[action]();
		return Response.json({ success: true }, { status: 200 });
	} catch (error) {
		return Response.json({ error: error, success: false }, { status: 500 });
	}
}
