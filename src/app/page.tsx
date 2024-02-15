import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import images from "@/lib/images";
export default function Home() {
  return (
    <main className="flex justify-center items-center mx-auto mt-72">
      <Card className="flex p-5 bg-bg-darker flex-col">
        <section className="flex flex-wrap justify-center">
          {images.map((image, key) => {
            return (
              <div className="w-1/4 p-2" key={key}>
                <Link href={`/image/${image.dockerImage.split("/")[2]}`}>
                  <Card className="flex bg-bg-idle hover:bg-bg-active w-64 h-24 flex-row gap-2">
                    <Image
                      src={image.icon}
                      alt={image.friendlyName}
                      width={45}
                      height={45}
                    />
                    <div className="flex flex-col justify-center">
                      <p className="text-cyan font-bold text-md text-nowrap">
                        {image.friendlyName}
                      </p>
                      <p className="text-text-secondary text-xs">
                        {image.category}
                      </p>
                    </div>
                  </Card>
                </Link>
              </div>
            );
          })}
        </section>
      </Card>
    </main>
  );
}
