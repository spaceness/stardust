import { Card } from "@/components/ui/card";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Skeleton } from "@/components/ui/skeleton";

import authConfig from "@/lib/auth.config";
import { db } from "@/lib/drizzle/db";
import { image, user } from "@/lib/drizzle/schema";
import { createSession, deleteSession } from "@/lib/util/session";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function Dashboard() {
	const userSession = await getServerSession(authConfig);
	const images = await db.select().from(image);
	const { userId } = (
		await db
			.select({
				userId: user.id,
			})
			.from(user)
			.where(eq(user.email, userSession?.user?.email as string))
	)[0];
	const sessions = await db.query.session.findMany({
		with: {
			image: true,
		},
		where: (users, { eq }) => eq(users.userId, userId),
	});
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
									if (!userSession) return;
									const containerSession = await createSession(
										image.dockerImage,
										userSession,
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
				<section className="mt-12 flex flex-col flex-wrap items-center justify-center gap-2">
					{sessions ? (
						<h1 className="text-nowrap text-xl font-medium">Your Sessions</h1>
					) : null}
					{sessions
						? sessions.map((session) => {
								const expiresAt = new Date(Number(session.expiresAt));
								return (
									// <Link key={session.id} href={`/view/${session.id}`}>
									<ContextMenu key={session.id}>
										<ContextMenuTrigger asChild>
											<Card className="flex h-24 w-56 flex-row items-center justify-center gap-2 bg-foreground/10 p-4 backdrop-blur-md duration-150 hover:bg-muted">
												<section>
													<Image
														src={session.image.icon}
														alt={session.image.friendlyName}
														width={72}
														height={72}
														className="size-12"
													/>
												</section>
												<span className="flex-col text-center">
													<div className="text-md text-ellipsis font-bold">
														{session.image.friendlyName}
														<p className="rounded-sm bg-muted p-[2px] font-mono text-xs text-muted-foreground">
															{session.id.slice(0, 6)}
														</p>
													</div>
													<p className="text-center text-xs text-muted-foreground">
														Expires at{" "}
														{`${expiresAt.toLocaleTimeString()} on ${expiresAt.getMonth()}/${expiresAt.getDate()}/${expiresAt.getFullYear()}`}
													</p>
												</span>
											</Card>
										</ContextMenuTrigger>
										<ContextMenuContent>
											<ContextMenuItem asChild>
												<Link href={`/view/${session.id}`}>View</Link>
											</ContextMenuItem>
											<ContextMenuItem asChild>
												<form
													action={async () => {
														"use server";
														if (!userSession) return;
														await deleteSession(session.id, userSession)
															.catch(console.error)
															.then(() => redirect("/"));
													}}
												>
													<button type="submit">Delete</button>
												</form>
											</ContextMenuItem>
										</ContextMenuContent>
									</ContextMenu>
									// </Link>
								);
							})
						: null}
				</section>
			</div>
		</div>
	);
}
