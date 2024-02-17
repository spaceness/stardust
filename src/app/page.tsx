import config from "@root/config.json";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";

export default function Home() {
  const images: Image[] = config.images;
  return (
    <main className="flex items-center justify-center min-h-screen">
      <Card className="bg-bg-darker grid grid-cols-3">
        {images.map((image, key) => (
          <Link
            href={`/launch/${image.dockerImage.split("/")[2]}`}
            className="w-1/4 m-2"
            key={key}
          >
            <Card className="flex md:w-56 w-24 h-24 gap-2 hover:bg-bg-active md:flex-row flex-col">
              <Image
                src={image.icon}
                alt={image.friendlyName}
                width={45}
                height={45}
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
