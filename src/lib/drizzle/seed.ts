import "dotenv/config";

import { exec } from "node:child_process";
import { type SelectImage, db, image as imageSchema } from "@/lib/drizzle/db";
(async () => {
	const images = [
		{
			dockerImage: "ghcr.io/spaceness/debian",
			friendlyName: "Debian",
			category: ["Desktop"],
			icon: "/images/workspaces/debian.svg",
		},
		{
			dockerImage: "ghcr.io/spaceness/debian-kde",
			friendlyName: "Debian KDE",
			category: ["Desktop"],
			icon: "https://wiki.debian.org/KDE?action=AttachFile&do=get&target=kde-logo-128x128.png",
		},
		{
			dockerImage: "ghcr.io/spaceness/chromium",
			friendlyName: "Chromium",
			category: ["Browser"],
			icon: "/images/workspaces/chromium.svg",
		},
		{
			dockerImage: "ghcr.io/spaceness/firefox",
			friendlyName: "Firefox",
			category: ["Browser"],
			icon: "/images/workspaces/firefox.svg",
		},
		{
			dockerImage: "ghcr.io/spaceness/gimp",
			friendlyName: "GIMP",
			category: ["Photo Editing"],
			icon: "https://www.gimp.org/images/frontpage/wilber-big.png",
		},
	];
	if (process.arch === "x64") {
		Object.assign(images, {
			dockerImage: "ghcr.io/spaceness/pinball",
			friendlyName: "Pinball",
			category: ["Games"],
			icon: "/icon.svg",
		} satisfies SelectImage);
	}
	const insertion = await db.insert(imageSchema).values(images).onConflictDoNothing().returning();
	console.log(`✨Stardust: Seeded ${insertion.length} images.`);
	console.log(`✨Stardust: Seeded ${insertion.map((i) => i.dockerImage).join(", ") || "no images"}`);
	if (process.argv.includes("--pull")) {
		console.log("Pulling images...");
		for (const image of images) {
			await new Promise<void>((resolve, reject) => {
				console.log(`✨Stardust: Pulling image ${image.dockerImage}`);
				exec(`docker pull ${image.dockerImage}`, (err, stdout, stderr) => {
					if (err) {
						console.error(`✨Stardust: Error pulling image ${image.dockerImage}`);
						process.stderr.write(stderr);
						console.error(err);
						reject(err);
					} else {
						process.stdout.write(stdout);
						console.log(`✨Stardust: Pulled image ${image.dockerImage}`);
						resolve();
					}
				});
			});
		}
	}
	process.exit();
})();
