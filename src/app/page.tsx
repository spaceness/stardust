import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import fetchConfig from "@/lib/fetchConfig";
import { Card } from "@/components/ui/card";

export default async function Home() {
	const config = await fetchConfig(headers().get("host"));
	const images: Image[] = await config.images;
	return (
		<main className="flex min-h-screen items-center justify-center">
			<Card className="grid grid-cols-3">
				{images.map((image, key) => (
					<Link
						href={`/launch/${image.dockerImage.split("/")[2]}`}
						className="rounded-md m-2 w-1/4 justify-center"
						key={key}
					>
						<Card className="flex h-24 w-24 flex-col gap-2 bg-bg-darker hover:bg-bg-darker-hover md:w-56 md:flex-row">
							<Image
								priority={true}
								src={image.icon}
								alt={image.friendlyName}
								width={24}
								height={24}
								className="h-auto w-auto"
							/>
							<div className="hidden flex-col justify-center md:flex">
								<p className="text-md text-ellipsis font-bold text-cyan">
									{image.friendlyName}
								</p>
								<p className="text-xs text-text-secondary">{image.category}</p>
							</div>
						</Card>
					</Link>
				))}
			</Card>
		</main>
	);
}
