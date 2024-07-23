"use server";

import docker from "@/lib/docker";
import { db } from "@/lib/drizzle/db";
import { type SelectImage, image, session } from "@/lib/drizzle/schema";
import { deleteSession } from "@/lib/session";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
function pullImage(image: string) {
	return new Promise((resolve, reject) => {
		docker.pull(image, (err: Error, stream: NodeJS.ReadableStream) => {
			if (err) reject(err);
			docker.modem.followProgress(stream, (err, res) => {
				if (err) {
					reject(err);
				} else {
					resolve(res);
				}
			});
		});
	});
}
export async function addImage(data: FormData) {
	const fields: SelectImage & { repull: boolean } = {
		dockerImage: data.get("dockerImage")?.toString() as string,
		friendlyName: data.get("friendlyName")?.toString() as string,
		category:
			data
				.get("category")
				?.toString()
				.split(",")
				.map((cat) => cat.trim()) || [],
		icon: data.get("icon")?.toString() as string,
		repull: Boolean(data.get("repull")),
	};
	if (fields.repull) {
		const oldImg = await docker.listImages({
			filters: JSON.stringify({ reference: [fields.dockerImage] }),
		});
		if (oldImg.length === 0) {
			await pullImage(fields.dockerImage);
		} else {
			await pullImage(fields.dockerImage);
			await deleteImage(oldImg[0].Id);
		}
	}
	await db
		.insert(image)
		.values(fields)
		.onConflictDoUpdate({
			target: image.dockerImage,
			set: {
				category: fields.category,
				friendlyName: fields.friendlyName,
				icon: fields.icon,
			},
		});
	redirect("/admin/images");
}

export async function deleteImage(dockerImage: string) {
	await Promise.all(
		(await db.select().from(session).where(eq(session.dockerImage, dockerImage))).map((s) => deleteSession(s.id, true)),
	);
	await docker
		.getImage(dockerImage)
		.remove()
		.catch(() => {});
	await db.delete(image).where(eq(image.dockerImage, dockerImage));
	revalidatePath("/admin/images");
}
