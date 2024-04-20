import { StyledSubmit } from "@/components/submit-button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import authConfig from "@/lib/auth.config";
import docker from "@/lib/docker";
import { db, image, user } from "@/lib/drizzle/db";
import { createSession, deleteSession, manageSession } from "@/lib/util/session";
import { eq } from "drizzle-orm";
import { Container, Loader2, Pause, Play, Square, TrashIcon } from "lucide-react";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
const errorCatcher = (error: any) => {
	throw new Error(error);
};
export default async function Dashboard() {
	const userSession = await getServerSession(authConfig);
	const images = await db.select().from(image).catch(errorCatcher);
	const { userId } = (
		await db
			.select({
				userId: user.id,
			})
			.from(user)
			.where(eq(user.email, userSession?.user?.email as string))
			.catch(errorCatcher)
	)[0];
	const sessions = await db.query.session
		.findMany({
			with: {
				image: true,
			},
			where: (users, { eq }) => eq(users.userId, userId),
		})
		.catch(errorCatcher);
	return (
		<div className="flex min-h-screen items-center justify-center">
			<div className="m-auto flex w-full max-w-5xl flex-col">
				<section className="flex flex-wrap justify-center gap-1">
					<Suspense fallback={<Loader2 size={64} className="animate-spin" />}>
						{images.map((image, key) => (
							<Dialog key={key}>
								<DialogTrigger asChild>
									<Card
										key={key}
										className="m-2 flex h-24 w-24 cursor-pointer flex-col items-center justify-start gap-2 bg-muted-foreground/10 p-2 backdrop-blur-md duration-150 hover:bg-muted/50 md:w-56 md:flex-row"
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
											<p className="text-md text-ellipsis font-bold">{image.friendlyName}</p>
											<p className="text-xs text-muted-foreground">{image.category}</p>
										</div>
									</Card>
								</DialogTrigger>
								<DialogContent>
									<form
										key={key}
										action={async () => {
											"use server";
											if (!userSession) return;
											const containerSession = await createSession(image.dockerImage, userSession).catch((e) => {
												throw new Error(e);
											});
											if (!containerSession) return;
											redirect(`/view/${containerSession[0].id}`);
										}}
									>
										<DialogHeader>
											<DialogTitle>{image.friendlyName}</DialogTitle>
											<DialogDescription>Launch a new {image.friendlyName} Session.</DialogDescription>
										</DialogHeader>
										<DialogFooter>
											<DialogClose asChild>
												<Button type="button" variant="secondary">
													Close
												</Button>
											</DialogClose>
											<StyledSubmit>Launch</StyledSubmit>
										</DialogFooter>
									</form>
								</DialogContent>
							</Dialog>
						))}
					</Suspense>
				</section>
				{sessions.length ? (
					<div className="mt-16 flex flex-col items-center justify-center gap-2">
						<section className="flex flex-wrap justify-center gap-5">
							<Suspense fallback={<Loader2 size={64} className="animate-spin" />}>
								{sessions
									? sessions.map(async (session) => {
											const { State } = await docker.getContainer(session.id).inspect();
											const expiresAt = new Date(session.expiresAt);
											return (
												<Card
													className="items-between m-2 flex h-auto w-[24rem] flex-col justify-between gap-2 bg-foreground/10 p-2 backdrop-blur-md md:w-56"
													key={session.id}
												>
													<section className="flex flex-row items-center justify-between gap-6">
														<Image
															src={session.image.icon}
															alt={session.image.friendlyName}
															width={48}
															height={49}
															className="ml-4 size-6"
														/>

														<div className="text-md text-ellipsis">
															<p className="font-bold">{session.image.friendlyName}</p>
															<p className="rounded-sm font-mono text-xs font-bold text-primary">
																{session.id.slice(0, 6)}
															</p>
															<p className="text-xs text-muted-foreground">
																Expires at{" "}
																{`${expiresAt.toLocaleTimeString()} on ${expiresAt.getMonth()}/${expiresAt.getDate()}/${expiresAt.getFullYear()}`}
															</p>
														</div>
													</section>
													{session.imagePreview ? (
														<Image src={session.imagePreview} width={500} height={300} alt="" className="rounded-sm" />
													) : (
														<div className="flex h-[6.5rem] w-[13rem] items-center justify-center rounded-sm bg-muted-foreground/40">
															<Container size={64} className="text-muted" />
														</div>
													)}
													<div className="flex w-full flex-row items-center justify-center gap-x-2">
														{!State.Paused && State.Running ? (
															<StyledSubmit variant="ghost" className="border" size="icon" asChild>
																<Link href={`/view/${session.id}`}>
																	<Play />
																</Link>
															</StyledSubmit>
														) : null}
														{!State.Paused && State.Running ? (
															<form
																action={async () => {
																	"use server";
																	if (!userSession) return;
																	await manageSession(session.id, "pause", userSession).catch(errorCatcher);
																	revalidatePath("/");
																}}
															>
																<StyledSubmit variant="ghost" className="border" size="icon" pendingSpinner>
																	<Pause />
																</StyledSubmit>
															</form>
														) : State.Paused ? (
															<form
																action={async () => {
																	"use server";
																	if (!userSession) return;
																	await manageSession(session.id, "unpause", userSession).catch(errorCatcher);
																	redirect(`/view/${session.id}`);
																}}
															>
																<StyledSubmit variant="ghost" className="border" size="icon" pendingSpinner>
																	<Play />
																</StyledSubmit>
															</form>
														) : null}
														{!State.Running ? (
															<form
																action={async () => {
																	"use server";
																	if (!userSession) return;
																	await manageSession(session.id, "start", userSession).catch(errorCatcher);
																	redirect(`/view/${session.id}`);
																}}
															>
																<StyledSubmit variant="ghost" className="border" size="icon" pendingSpinner>
																	<Play />
																</StyledSubmit>
															</form>
														) : State.Running ? (
															<form
																action={async () => {
																	"use server";
																	if (!userSession) return;
																	await manageSession(session.id, "stop", userSession).catch(errorCatcher);
																	revalidatePath("/");
																}}
															>
																<StyledSubmit variant="ghost" className="border" size="icon" pendingSpinner>
																	<Square className="text-destructive" />
																</StyledSubmit>
															</form>
														) : null}
														<form
															action={async () => {
																"use server";
																if (!userSession) return;
																await deleteSession(session.id, userSession).catch(errorCatcher);
																revalidatePath("/");
															}}
														>
															<StyledSubmit variant="ghost" className="border" size="icon" pendingSpinner>
																<TrashIcon className="text-destructive" />
															</StyledSubmit>
														</form>
													</div>
												</Card>
											);
										})
									: null}
							</Suspense>
						</section>
					</div>
				) : null}
			</div>
		</div>
	);
}
