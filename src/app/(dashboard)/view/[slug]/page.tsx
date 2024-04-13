"use client";

import { deleteSession, manageSession } from "@/actions/session";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { VncViewerHandle } from "@/components/vnc-screen";
import { ChevronRight, LogOut, LucideHome, Pause, Play, Sparkles, TrashIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense, lazy, useEffect, useRef, useState } from "react";
const Loading = () => (
	<div className="flex h-screen flex-col items-center justify-center">
		<Sparkles className="size-12 animate-pulse" />
	</div>
);
const VncScreen = lazy(() => import("@/components/vnc-screen"));
export default function View({ params }: { params: { slug: string } }) {
	const vncRef = useRef<VncViewerHandle>(null);
	const [session, setSession] = useState<{
		exists: boolean;
		url: string | null;
		paused?: boolean;
	} | null>(null);
	const [clipboard, setClipboard] = useState<string | undefined>();
	useEffect(() => {
		fetch(`/api/websockify/${params.slug}`)
			.then((res) => res.json())
			.then((data) => {
				if (data.exists) {
					setSession({ exists: true, url: `/api/websockify/${params.slug}`, paused: data.paused ?? false });
				} else {
					setSession({ exists: false, url: null });
				}
			});
	}, [params.slug]);
	return (
		<div className="flex h-screen w-full flex-grow justify-center">
			{session?.exists ? (
				<Sheet>
					<SheetTrigger asChild>
						<Button
							size="icon"
							variant="default"
							className="absolute left-0 right-2 top-1/2 h-16 rounded-l-none border-l-0"
						>
							<ChevronRight />
						</Button>
					</SheetTrigger>
					<SheetContent side="left">
						<SheetTitle className="py-2 text-3xl">Settings</SheetTitle>
						<SheetHeader>
							<SheetTitle>Clipboard</SheetTitle>
							<SheetDescription>Contents of the clipboard will be shared with the remote machine.</SheetDescription>
						</SheetHeader>
						<div className="grid gap-4 py-4">
							<Textarea
								className="h-32 w-full"
								placeholder="Type here to share with remote machine"
								value={clipboard}
								onChange={(e) => {
									if (!vncRef.current?.rfb) throw new Error("RFB not initialized");
									vncRef.current.rfb.clipboardPasteFrom(e.target.value);
									setClipboard(e.target.value);
								}}
							/>
						</div>
						<section className="flex gap-2">
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button size="icon" asChild>
											<Link href="/">
												<LucideHome className="size-5" />
											</Link>
										</Button>
									</TooltipTrigger>
									<TooltipContent>Home</TooltipContent>
								</Tooltip>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											variant="secondary"
											size="icon"
											onClick={() => {
												setSession(session.paused ? { ...session, paused: false } : null);
												manageSession(params.slug, session.paused ? "unpause" : "pause", !session.paused);
											}}
										>
											{session.paused ? <Play /> : <Pause />}
										</Button>
									</TooltipTrigger>
									<TooltipContent>{session.paused ? "Resume" : "Pause"} Session</TooltipContent>
								</Tooltip>
								<AlertDialog>
									<Tooltip>
										<TooltipTrigger asChild>
											<AlertDialogTrigger asChild>
												<Button size="icon" variant="destructive">
													<TrashIcon className="size-5" />
												</Button>
											</AlertDialogTrigger>
										</TooltipTrigger>
										<TooltipContent>Delete</TooltipContent>
									</Tooltip>
									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
											<AlertDialogDescription>
												Are you 100% sure you want to delete this session?
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>Cancel</AlertDialogCancel>
											<AlertDialogAction
												onClick={() => {
													setSession(null);
													deleteSession(params.slug);
												}}
											>
												Continue
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button size="icon" variant="destructive" asChild>
											<Link href="/auth/logout">
												<LogOut className="size-5" />
											</Link>
										</Button>
									</TooltipTrigger>
									<TooltipContent>Log Out</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</section>
					</SheetContent>
				</Sheet>
			) : null}
			{session ? (
				session.exists ? (
					session.url ? (
						!session.paused ? (
							<Suspense fallback={<Loading />}>
								<VncScreen
									url={session.url}
									loader={<Loading />}
									onClipboard={(e) => setClipboard(e?.detail?.text)}
									ref={vncRef}
									rfbOptions={{
										credentials: {
											username: "",
											password: "stardustVnc123",
											target: "",
										},
									}}
								/>
							</Suspense>
						) : (
							<div className="flex h-screen w-full flex-grow justify-center gap-2">
								<div className="flex flex-col items-center justify-center gap-2">
									<h1 className="text-3xl font-bold">Session Paused</h1>
									<p className="text-lg text-muted-foreground">This session is paused.</p>
									<Button
										onClick={() => {
											setSession({ ...session, paused: false });
											manageSession(params.slug, "unpause", false);
										}}
									>
										Resume
									</Button>
								</div>
							</div>
						)
					) : null
				) : (
					notFound()
				)
			) : (
				<Loading />
			)}
		</div>
	);
}
