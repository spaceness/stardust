import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import images from "@/lib/images";
export default function Home() {
  return (
    <main className="flex justify-center items-center mx-auto mt-72">
      <Card className="flex p-5 bg-bg-darker flex-col">
        <section className="flex flex-wrap justify-center">
          {Object.keys(images).map((image) => {
            const { friendlyName, icon, category } = images[image];
            return (
              <div className="w-1/4 p-2" key={image}>
                <Link href={`/image/${image}`}>
                  <Card
                    key={image}
                    className="flex bg-bg-idle hover:bg-bg-active w-full h-24 flex-row gap-2"
                  >
                    <Image
                      src={icon}
                      alt={friendlyName}
                      width={45}
                      height={45}
                    />
                    <div className="flex flex-col justify-center">
                      <p className="text-cyan font-bold text-md">
                        {friendlyName}
                      </p>
                      <p className="text-text-tertiary text-xs">
                        Categories: {category}
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
