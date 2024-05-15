import "dotenv/config";

import { db, image } from "@/lib/drizzle/db";
(async () => {
	const insertion = await db
		.insert(image)
		.values([
			{
				dockerImage: "ghcr.io/spaceness/debian",
				friendlyName: "Debian",
				category: ["Desktop"],
				icon: "/images/workspaces/debian.svg",
			},
			{
				dockerImage: "ghcr.io/spaceness/chromium",
				friendlyName: "Chromium",
				category: ["Browser"],
				icon: "/images/workspaces/chromium.svg",
			},
		])
		.onConflictDoNothing()
		.returning();
	console.log(insertion);
	console.log("✨ Stardust: Seeded image");
	process.exit();
})();
