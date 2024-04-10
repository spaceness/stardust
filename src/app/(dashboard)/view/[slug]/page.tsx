"use client";

import { deleteSession } from "@/actions/delete-session";
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

import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	ChevronRight,
	LogOut,
	LucideHome,
	Sparkles,
	TrashIcon,
} from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";

const Loading = () => (
	<div className="flex h-screen flex-col items-center justify-center">
		<Sparkles className="size-12 animate-pulse" />
	</div>
);

const VncScreen = dynamic(() => import("@/components/vnc-screen"), {
	ssr: false,
	loading: Loading,
});
export default function View({ params }: { params: { slug: string } }) {
	const [session, setSession] = useState<{
		exists: boolean;
		url: string | null;
	} | null>(null);
	const [clipboard, setClipboard] = useState<string | undefined>();
	useEffect(() => {
		fetch(`/api/websockify/${params.slug}`)
			.then((res) => res.json())
			.then((data) => {
				if (data.exists) {
					setSession({ exists: true, url: `/api/websockify/${params.slug}` });
				} else {
					setSession({ exists: false, url: null });
				}
			});
	}, [params.slug]);
	return (
		<>
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
							<section className="flex gap-2">
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											<Button size="icon" asChild variant="outline">
												<Link href="/">
													<LucideHome className="size-5" />
												</Link>
											</Button>
										</TooltipTrigger>
										<TooltipContent>Home</TooltipContent>
									</Tooltip>
									<AlertDialog>
										<AlertDialogTrigger asChild>
											<Tooltip>
												<TooltipTrigger asChild>
													<Button size="icon" variant="destructive">
														<TrashIcon className="size-5" />
													</Button>
												</TooltipTrigger>
												<TooltipContent>Delete</TooltipContent>
											</Tooltip>
										</AlertDialogTrigger>
										<AlertDialogContent>
											<AlertDialogHeader>
												<AlertDialogTitle>
													Are you absolutely sure?
												</AlertDialogTitle>
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
													{" "}
													<LogOut className="size-5" />
												</Link>
											</Button>
										</TooltipTrigger>
										<TooltipContent>Log Out</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							</section>
							<SheetTitle className="py-2 text-3xl">Settings</SheetTitle>
							<SheetHeader>
								<SheetTitle>Clipboard</SheetTitle>
								<SheetDescription>
									Contents of the clipboard will be shared with the remote
									machine.
								</SheetDescription>
							</SheetHeader>
							<div className="grid gap-4 py-4">
								<Textarea
									className="h-32 w-full"
									placeholder="Type here to share with remote machine"
									value={clipboard}
									onChange={(e) => setClipboard(e.target.value)}
								/>
							</div>
						</SheetContent>
					</Sheet>
				) : null}
				{session ? (
					session.exists ? (
						session.url ? (
							<VncScreen
								url={session.url}
								loader={<Loading />}
								onClipboard={(e) => {
									setClipboard(e?.detail?.text);
								}}
								rfbOptions={{
									credentials: {
										username: "",
										password: "stardustVnc123",
										target: "",
									},
								}}
							/>
						) : null
					) : (
						notFound()
					)
				) : (
					<Loading />
				)}
			</div>
		</>
	);
}
