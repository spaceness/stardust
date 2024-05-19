import "dotenv/config";

import { exec } from "node:child_process";
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
  console.log(`✨Stardust: Seeded ${insertion.map((i) => i.dockerImage).join(", ") || "no images"}`)
  if (process.argv.includes("--pull")) {
    console.log("Pulling images...")
    for (let i = 0; i < images.length; i++) {
      const image = images[i]
      await new Promise<void>((resolve, reject) => {
        console.log(`✨Stardust: Pulling image ${image.dockerImage}`)
        exec(`docker pull ${image.dockerImage}`, (err, stdout, stderr) => {
          if (err) {
            console.error(`✨Stardust: Error pulling image ${image.dockerImage}`)
            console.error(stderr)
            console.error(err)
            reject(err)
          } else {
            console.log(stdout)
            console.log(`✨Stardust: Pulled image ${image.dockerImage}`)
            resolve()
          }
        })
      })
    }
  }
  process.exit()
})()
