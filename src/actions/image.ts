"use server";

import docker from "@/lib/docker";
import { db } from "@/lib/drizzle/db";
import { image, insertImageSchema } from "@/lib/drizzle/schema";
import { revalidatePath } from "next/cache";

export async function addImage(data: FormData) {
	const validatedFields = insertImageSchema.safeParse({
		dockerImage: data.get("dockerImage"),
		friendlyName: data.get("friendlyName"),
		category: data
			.get("category")
			?.toString()
			.split(",")
			.map((cat) => cat.trim()),
		icon: data.get("icon"),
		pulled: true,
	});
	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
		};
	}
	await new Promise((resolve, reject) =>
		docker.pull(validatedFields.data.dockerImage, (_err: Error, stream: NodeJS.ReadableStream) => {
			docker.modem.followProgress(stream, (err, res) => {
				if (err) {
					reject(err);
				} else {
					resolve(res);
				}
			});
		}),
	);
	await db
		.insert(image)
		.values({
			category: [validatedFields.data.category as string],
			dockerImage: validatedFields.data.dockerImage,
			friendlyName: validatedFields.data.friendlyName,
			icon: validatedFields.data.icon,
			pulled: validatedFields.data.pulled,
		})
		.onConflictDoUpdate({
			target: image.dockerImage,
			set: {
				category: [validatedFields.data.category as string],
				friendlyName: validatedFields.data.friendlyName,
				icon: validatedFields.data.icon,
				pulled: validatedFields.data.pulled,
			},
		});
	revalidatePath("/admin/images");
	return { success: true };
}
