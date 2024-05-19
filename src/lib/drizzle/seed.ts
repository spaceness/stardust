import "dotenv/config";

import { execSync } from "node:child_process";
import { db, image as imageSchema } from "@/lib/drizzle/db";

(async () => {
  const images = [
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
  ]
  const insertion = await db.insert(imageSchema).values(images).onConflictDoNothing().returning()
  console.log(`✨Stardust: Seeded ${insertion.length} images.`)
  console.log(`✨Stardust: Seeded ${insertion.map((i) => i.dockerImage).join(", ")}`)
  if (process.argv.includes("--pull")) {
    console.log("Pulling images...")
    for (const image of images) {
      execSync(`docker pull ${image.dockerImage}`)
    }
  }
  process.exit();
})();
