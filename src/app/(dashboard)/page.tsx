import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
export default async function Dashboard() {
	const images = await prisma.image.findMany();
	return (
		<div className="flex min-h-screen items-center justify-center">
			<section className="grid grid-cols-3 place-items-center">
				{images.map((image, key) => (
					<Link
						href={`/launch/${image.dockerImage.split("/")[2]}`}
						className="flex rounded-lg"
						key={key}
					>
						<Card
							key={key}
							className="m-2 flex h-24 w-24 flex-col items-center justify-start gap-2 bg-background p-2 duration-150 hover:bg-secondary md:w-56 md:flex-row"
						>
							<Image
								priority={true}
								src={image.icon}
								alt={image.friendlyName}
								width={12}
								height={12}
								className="mx-4 h-12 w-12"
							/>
							<div className="hidden flex-col justify-center md:flex">
								<p className="text-md text-ellipsis font-bold">
									{image.friendlyName}
								</p>
								<p className="text-xs text-muted-foreground">
									{image.category}
								</p>
							</div>
						</Card>
					</Link>
				))}
			</section>
		</div>
	);
}
