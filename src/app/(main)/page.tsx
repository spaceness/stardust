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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getAuthSession } from "@/lib/auth";
import docker from "@/lib/docker";
import { db, image, user } from "@/lib/drizzle/db";
import { createSession, deleteSession, manageSession } from "@/lib/util/session";
import { eq } from "drizzle-orm";
import { Container, Loader2, Pause, Play, Square, TrashIcon } from "lucide-react";
import { revalidatePath } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
const errorCatcher = (error: string) => {
	throw new Error(error);
};
export default async function Dashboard() {
	const userSession = await getAuthSession();
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
		<div className="flex h-full items-center justify-center">
			<div className="m-auto flex w-full max-w-5xl flex-col">
				<Tabs defaultValue="workspaces" className="flex justify-center items-center flex-col top-12">
					<TabsList className="md:absolute top-16">
						<TabsTrigger value="workspaces">Workspaces</TabsTrigger>
						<TabsTrigger value="sessions">Sessions</TabsTrigger>
					</TabsList>
					<TabsContent value="workspaces">
						<section className="flex flex-wrap justify-center gap-1">
							<Suspense fallback={<Loader2 size={64} className="animate-spin" />}>
								{images.map((image) => (
									<Dialog key={image.dockerImage}>
										<DialogTrigger asChild>
											<Card
												key={image.dockerImage}
												className="m-2 flex h-24 w-24 cursor-pointer flex-col items-center justify-start gap-2 bg-background/75 p-2 backdrop-blur-md duration-150 hover:bg-muted md:w-56 md:flex-row"
											>
												<Image
													priority={true}
													src={image.icon}
													alt={image.friendlyName}
													width={72}
													height={72}
													className="h-12 w-12 md:mx-4"
												/>
												<div className=" flex-col justify-center flex">
													<p className="text-md text-ellipsis font-bold">{image.friendlyName}</p>
													<p className="text-xs text-muted-foreground md:block hidden">{image.category}</p>
												</div>
											</Card>
										</DialogTrigger>
										<DialogContent className="flex md:flex-col flex-row justify-center gap-2">
											<form
												action={async () => {
													"use server";
													if (!userSession) return;
													const containerSession = await createSession(image.dockerImage, userSession).catch((e) => {
														throw new Error(e);
													});
													if (!containerSession) return;
													redirect(`/view/${containerSession[0].id}?nocheck=true`);
												}}
											>
												<DialogHeader>
													<DialogTitle>Launch session</DialogTitle>
													<DialogDescription>Start a new {image.friendlyName} session?</DialogDescription>
												</DialogHeader>
												<DialogFooter>
													<DialogClose asChild>
														<Button type="button" variant="secondary" className="hidden md:block">
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
					</TabsContent>
					<TabsContent value="sessions" className="flex flex-col md:flex-row">
						<Suspense fallback={<Loader2 size={64} className="animate-spin" />}>
							{sessions.length ? (
								sessions.map(async (session) => {
									const { State } = await docker.getContainer(session.id).inspect();
									const expiresAt = new Date(session.expiresAt);
									return (
										<Card
											className="items-between m-2 flex h-auto w-[16rem] flex-col justify-between gap-2 bg-background/75 p-2 backdrop-blur-md md:w-56"
											key={session.id}
										>
											<section className="flex flex-row items-center justify-between gap-6">
												<Image
													src={session.image.icon}
													alt={session.image.friendlyName}
													width={48}
													height={48}
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
												<AspectRatio ratio={16 / 9}>
													<Image
														src={session.imagePreview}
														fill
														alt=""
														className="object-fill rounded-sm md:h-[6.5rem] md:w-[13rem] h-[3.25rem] w-[6.5rem]"
													/>
												</AspectRatio>
											) : (
												<div className="flex md:h-[6.5rem] md:w-[13rem] h-[6.5rem] items-center justify-center rounded-sm bg-muted-foreground/40">
													<Container size={64} className="text-muted" />
												</div>
											)}
											<div className="flex w-full flex-row items-center justify-center gap-x-2">
												{!State.Paused && State.Running ? (
													<StyledSubmit variant="ghost" size="icon" pendingSpinner>
														<Link
															href={{
																pathname: `/view/${session.id}`,
																query: { nocheck: true },
															}}
														>
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
														<StyledSubmit variant="ghost" size="icon" pendingSpinner>
															<Pause />
														</StyledSubmit>
													</form>
												) : State.Paused ? (
													<form
														action={async () => {
															"use server";
															if (!userSession) return;
															await manageSession(session.id, "unpause", userSession).catch(errorCatcher);
															redirect(`/view/${session.id}?nocheck=true`);
														}}
													>
														<StyledSubmit variant="ghost" size="icon" pendingSpinner>
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
															redirect(`/view/${session.id}?nocheck=true`);
														}}
													>
														<StyledSubmit variant="ghost" size="icon" pendingSpinner>
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
														<StyledSubmit variant="ghost" size="icon" pendingSpinner>
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
													<StyledSubmit variant="destructive" size="icon" pendingSpinner>
														<TrashIcon />
													</StyledSubmit>
												</form>
											</div>
										</Card>
									);
								})
							) : (
								<div className="flex items-center justify-center flex-col w-full h-full bg-background/75 backdrop-blur-md p-24 rounded-md">
									<p className="text-lg text-foreground">No sessions found</p>
									<p className="text-xs text-muted-foreground">Start a new session to see it here</p>
								</div>
							)}
						</Suspense>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
