import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Stardust",
    short_name: "Stardust",
    description: "Stardust is the platform for streaming isolated desktop containers.",
    start_url: "/",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#09090b",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
