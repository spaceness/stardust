import { db, image as imageSchema } from "@/lib/drizzle/db";
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
const insertion = await db.insert(imageSchema).values(images).onConflictDoNothing().returning();
console.log(`✨Stardust: Seeded ${insertion.map((i) => i.dockerImage).join(", ") || "no images"}`);
process.exit(0);
