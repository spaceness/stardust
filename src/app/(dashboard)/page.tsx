import { db } from "@/lib/drizzle/db";
import { image } from "@/lib/drizzle/schema";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
export default async function Dashboard() {
	const images = await db.select().from(image);
	return (
		<div className="flex min-h-screen items-center justify-center">
			<div className="m-auto flex w-full max-w-5xl flex-col">
				<section className="flex flex-wrap justify-center gap-1">
					<Suspense
						fallback={
							<Skeleton className="m-2 flex h-56 w-[96rem] flex-col items-center justify-start gap-2 md:w-56 md:flex-row" />
						}
					>
						{images.map((image, key) => (
							<Link
								href={`/launch/${image.dockerImage.split("/")[2]}`}
								className="rounded-lg"
								key={key}
							>
								<Card
									key={key}
									className="m-2 flex h-24 w-24 flex-col items-center justify-start gap-2 bg-foreground/10 p-2 backdrop-blur-md duration-150 hover:bg-muted md:w-56 md:flex-row"
								>
									<Image
										priority={true}
										src={image.icon}
										alt={image.friendlyName}
										width={72}
										height={72}
										className="h-12 w-12 md:mx-4"
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
					</Suspense>
				</section>
			</div>
		</div>
	);
}
