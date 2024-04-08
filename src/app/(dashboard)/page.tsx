import { db } from "@/lib/drizzle/db";
import { image } from "@/lib/drizzle/schema";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { createSession } from "@/lib/util/session";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import authConfig from "@/lib/auth.config";
export default async function Dashboard() {
	const session = await getServerSession(authConfig);
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
							<form
								key={key}
								action={async () => {
									"use server";
									if (!session) return;
									const containerSession = await createSession(
										image.dockerImage,
										session,
									).catch(console.error);
									if (!containerSession) return;
									redirect(`/view/${containerSession[0].id}`);
								}}
							>
								<button className="rounded-lg" key={key} type="submit">
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
								</button>
							</form>
						))}
					</Suspense>
				</section>
			</div>
		</div>
	);
}
