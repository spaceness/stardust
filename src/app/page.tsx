import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import { Card } from "@/components/ui/card";

export default async function Home() {
  const protocol = process?.env.SSL === "true" ? "https" : "http";
  const config = await fetch(
    `${protocol}://${headers().get("host")}/api/config`,
  )
    .then((res) => res.json())
    .then((data) => data.config);
  const images: Image[] = await config.images;
  return (
    <main className="flex items-center justify-center min-h-screen">
      <Card className="grid grid-cols-3">
        {images.map((image, key) => (
          <Link
            href={`/launch/${image.dockerImage.split("/")[2]}`}
            className="w-1/4 m-2 rounded-md justify-center"
            key={key}
          >
            <Card className="flex md:w-56 w-24 h-24 gap-2 bg-bg-darker hover:bg-bg-darker-hover md:flex-row flex-col">
              <Image
                priority={true}
                src={image.icon}
                alt={image.friendlyName}
                width={24}
                height={24}
                className="w-auto h-auto"
              />
              <div className="md:flex flex-col justify-center hidden">
                <p className="text-cyan font-bold text-md text-ellipsis">
                  {image.friendlyName}
                </p>
                <p className="text-text-secondary text-xs">{image.category}</p>
              </div>
            </Card>
          </Link>
        ))}
      </Card>
    </main>
  );
}
