import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import authConfig from "@/lib/auth.config";
import { db } from "@/lib/drizzle/db";
import { image, user } from "@/lib/drizzle/schema";
import { createSession } from "@/lib/util/session";
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
				<section className="flex flex-wrap justify-center gap-1 fixed bottom-6 right-1/2 left-1/2">
					{sessions
						? sessions.map((session) => {
							const expiresAt = new Date(Number(session.expiresAt));
							return (
								<Link key={session.id} href={`/view/${session.id}`}>
									<Card className="flex items-center justify-center bg-foreground/10 p-4 gap-2 backdrop-blur-md hover:bg-muted duration-150 flex-col w-56 h-24">
										<Image
											src={session.image.icon}
											alt={session.image.friendlyName}
											width={72}
											height={72}
											className="size-12"
										/>
										<p className="text-center text-xs text-muted-foreground">
										Expires at {`${expiresAt.toLocaleTimeString()} on ${expiresAt.getMonth()}/${expiresAt.getDate()}/${expiresAt.getFullYear()}`}
										</p>
									</Card>
								</Link>
							)})
						: null}
				</section>
			</div>
		</div>
	);
}
