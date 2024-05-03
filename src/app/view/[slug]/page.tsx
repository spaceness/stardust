"use client";

import { deleteSession, manageSession } from "@/lib/session";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { VncViewerHandle } from "@/components/vnc-screen";
import { fetcher } from "@/lib/utils";
import {
	AlertCircle,
	ChevronRight,
	Clipboard,
	Download,
	File,
	Info,
	LogOut,
	Maximize,
	Minimize,
	MonitorUp,
	Pause,
	RotateCw,
	ScreenShareOff,
	Sparkles,
	TrashIcon,
	Upload,
} from "lucide-react";
import { notFound, useRouter } from "next/navigation";
import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import useSWR, { useSWRConfig } from "swr";
import Link from "next/link";
type ScalingValues = "remote" | "local" | "none";
const Loading = ({ text }: { text: string }) => (
	<Card className="flex absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 flex-col items-center justify-center gap-2 size-72">
		<Sparkles className="size-16 animate-pulse" />
		<h1 className="text-xl font-semibold">{text}</h1>
	</Card>
);
const VncScreen = lazy(() => import("@/components/vnc-screen"));
export default function View({ params }: { params: { slug: string } }) {
	const vncRef = useRef<VncViewerHandle>(null);
	const [session, setSession] = useState<{
		exists: boolean;
		url: string | null;
		error?: string;
		paused?: boolean;
		password?: string;
	} | null>(null);
	const [connected, setConnected] = useState(false);
	const [fullScreen, setFullScreen] = useState(false);
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [accordionValue, setAccordionValue] = useState<string | undefined>(undefined);
	const [workingClipboard, setWorkingClipboard] = useState(true);
	// noVNC options start
	const [clipboard, setClipboard] = useState("");
	const [viewOnly, setViewOnly] = useState(false);
	const [qualityLevel, setQualityLevel] = useState(6);
	const [compressionLevel, setCompressionLevel] = useState(2);
	const [clipViewport, setClipViewport] = useState(false);
	const [scaling, setScaling] = useState<ScalingValues>("remote");
	// noVNC options end
	const router = useRouter();
	const { mutate } = useSWRConfig();
	const {
		data: filesList,
		error: filesError,
		isLoading: filesLoading,
	} = useSWR<string[]>(`/api/session/${params.slug}/files`, fetcher, { refreshInterval: 10000 });
	useEffect(() => {
		if (!session)
			fetch(`/api/vnc/${params.slug}`)
				.then((res) => res.json())
				.then((data) => {
					setSession(data);
				})
				.catch(() => {});
	}, [session, params.slug]);
	useEffect(() => {
		if (connected && vncRef.current?.rfb) {
			vncRef.current.rfb.viewOnly = viewOnly;
			vncRef.current.rfb.qualityLevel = qualityLevel;
			vncRef.current.rfb.compressionLevel = compressionLevel;
			vncRef.current.rfb.clipViewport = clipViewport;
			vncRef.current.rfb.resizeSession = scaling === "remote";
			vncRef.current.rfb.scaleViewport = scaling === "local";
		}
	}, [connected, viewOnly, qualityLevel, compressionLevel, scaling, clipViewport]);
	// jank, but it works ¯\_(ツ)_/¯
	useEffect(() => {
		const interval = setInterval(() => {
			if (connected && vncRef.current?.rfb && document.hasFocus()) {
				vncRef.current.rfb.focus();
				navigator.clipboard
					.readText()
					.then((text) => {
						if (text !== clipboard) {
							setWorkingClipboard(true);
							vncRef.current?.clipboardPaste(text);
							setClipboard(text);
						}
					})
					.catch(() => setWorkingClipboard(false));
			}
		}, 250);
		return () => clearInterval(interval);
	}, [connected, clipboard]);
	useEffect(() => {
		const interval = setInterval(() => {
			if (connected && document.hasFocus()) fetch(`/api/session/${params.slug}/keepalive`, { method: "POST" });
		}, 10000);
		return () => clearInterval(interval);
	});
	useEffect(() => {
		if (document.fullscreenElement === null && fullScreen) {
			document.documentElement.requestFullscreen();
		} else if (document.fullscreenElement !== null && !fullScreen) {
			document.exitFullscreen();
		}
	}, [fullScreen]);
	return (
		<div className="h-screen w-screen">
			{connected ? (
				<Button
					size="icon"
					hidden={sidebarOpen}
					className="absolute left-0 right-2 top-1/2 z-40 h-16 w-8 rounded-l-none border-l-0 bg-primary/70 backdrop-blur-md"
					onClick={() => setSidebarOpen((prev) => !prev)}
				>
					<ChevronRight />
				</Button>
			) : null}
			<Sheet
				open={sidebarOpen}
				onOpenChange={(value) => {
					setSidebarOpen(value);
					mutate(`/api/session/${params.slug}/files`);
				}}
			>
				<SheetContent
					side="left"
					className="z-50 flex flex-col overflow-y-auto overflow-x-clip bg-background/75 backdrop-blur-lg"
				>
					<SheetHeader>
						<SheetTitle className="py-2 text-2xl">Control Panel</SheetTitle>
						<SheetDescription className="text-muted-foreground">
							Manage your session with these controls
						</SheetDescription>
					</SheetHeader>
					<div className="flex flex-col gap-4">
						<section className="grid sm:grid-cols-2 gap-2 grid-cols-1">
							<Button
								className="w-[98%]"
								onClick={() => {
									setSidebarOpen(false);
									vncRef.current?.rfb?.disconnect();
									router.push("/");
								}}
							>
								<ScreenShareOff className="mr-2 size-5 flex-shrink-0" />
								Disconnect
							</Button>
							<Button
								className="w-[98%]"
								onClick={() => {
									vncRef.current?.rfb?.disconnect();
									toast.promise(() => manageSession(params.slug, "pause").then(() => router.push("/")), {
										loading: "Pausing container...",
										success: "Session paused",
										error: "Failed to pause container",
									});
								}}
							>
								<Pause className="mr-2 size-5 flex-shrink-0" />
								Pause Session
							</Button>
							<Button
								className="w-[98%]"
								onClick={() => {
									toast.promise(() => manageSession(params.slug, "restart"), {
										loading: "Restarting container...",
										success: "Session restarted",
										error: "Failed to restart container",
									});
								}}
							>
								<RotateCw className="mr-2 size-5 flex-shrink-0" />
								Restart Session
							</Button>
							<AlertDialog>
								<AlertDialogTrigger asChild>
									<Button variant="destructive" className="w-[98%]">
										<TrashIcon className="mr-2 size-5 flex-shrink-0" />
										Delete Session
									</Button>
								</AlertDialogTrigger>

								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>Confirm session deletion</AlertDialogTitle>
										<AlertDialogDescription>
											Are you sure you want to delete this session? This action is irreversible.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>Cancel</AlertDialogCancel>
										<AlertDialogAction
											asChild
											onClick={() => {
												vncRef.current?.rfb?.disconnect();
												toast.promise(() => deleteSession(params.slug).then(() => router.push("/")), {
													loading: "Deleting session...",
													success: "Session deleted",
													error: "Failed to delete session",
												});
											}}
										>
											<Button variant="destructive">Delete Session</Button>
										</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
							<Button className="w-[98%]" variant="secondary" asChild>
								<Link href="/auth/logout">
									<LogOut className="mr-2 size-5 flex-shrink-0" />
									Log Out
								</Link>
							</Button>
							<Button className="w-[98%]" variant="secondary" onClick={() => setFullScreen(!fullScreen)}>
								{fullScreen ? (
									<>
										<Minimize className="mr-2 size-5 flex-shrink-0" />
										Exit Fullscreen
									</>
								) : (
									<>
										<Maximize className="mr-2 size-5 flex-shrink-0" />
										Enter Fullscreen
									</>
								)}
							</Button>
						</section>
						<Accordion
							type="single"
							collapsible
							className="w-full"
							onValueChange={setAccordionValue}
							value={accordionValue}
						>
							<AccordionItem value="clipboard">
								<AccordionTrigger>
									<div className="p-2 rounded">
										<Clipboard className="size-5" />
									</div>
									<span className="text-lg">Clipboard</span>
								</AccordionTrigger>
								<AccordionContent className="flex flex-col gap-4">
									<Textarea
										className="h-48 w-full font-mono"
										tabIndex={-20}
										spellCheck={false}
										autoCorrect="off"
										autoCapitalize="off"
										value={!workingClipboard ? clipboard : undefined}
										disabled={workingClipboard}
										placeholder={
											workingClipboard ? "Clipboard is already synced" : "Paste here to send to remote machine"
										}
										onChange={(e) => {
											if (vncRef.current?.rfb) {
												setClipboard(e.target.value);
												vncRef.current.clipboardPaste(e.target.value);
											}
										}}
									/>
									{workingClipboard ? null : (
										<Button
											type="button"
											className="text-start place-self-start"
											onClick={() => {
												navigator.clipboard
													.readText()
													.then((text) => {
														setClipboard(text);
														vncRef.current?.clipboardPaste(text);
														setWorkingClipboard(true);
													})
													.catch(() => {
														setWorkingClipboard(false);
														toast.error("Failed to read clipboard, did you deny clipboard permissions?");
													});
											}}
										>
											Click here to sync clipboard
										</Button>
									)}
								</AccordionContent>
							</AccordionItem>
							<AccordionItem value="filesDownload">
								<AccordionTrigger>
									<div className="p-2 rounded">
										<Download className="size-5" />
									</div>
									<h2 className="text-lg">Download Files</h2>
								</AccordionTrigger>
								<AccordionContent className="flex flex-col gap-2">
									<p className="text-muted-foreground">Files in the session's Downloads folder will appear here.</p>
									{!filesError ? (
										!filesLoading ? (
											filesList && filesList?.length > 0 ? (
												filesList.map((file) => (
													<Card key={file} className="flex justify-between items-center p-4 h-16 w-full gap-2">
														<File className="size-5 flex-shrink-0" />
														<span className="text-sm truncate overflow-x-scroll">{file}</span>
														<Button size="icon" className="flex-shrink-0" asChild>
															<Link
																download={file}
																href={{
																	pathname: `/api/session/${params.slug}/files`,
																	query: { name: file },
																}}
															>
																<Download />
															</Link>
														</Button>
													</Card>
												))
											) : (
												<Alert>
													<Info className="size-4" />
													<AlertTitle>No files found</AlertTitle>
													<AlertDescription>Is your Downloads folder empty?</AlertDescription>
												</Alert>
											)
										) : (
											<Skeleton className="h-16 w-full" />
										)
									) : (
										<Alert variant="destructive">
											<AlertCircle className="size-4" />
											<AlertTitle>Error</AlertTitle>
											<AlertDescription>
												Failed to fetch files:
												<br />
												<code className="font-mono font-semibold">{filesError.message}</code>
											</AlertDescription>
										</Alert>
									)}
								</AccordionContent>
							</AccordionItem>
							<AccordionItem value="filesUpload">
								<AccordionTrigger>
									<div className="p-2 rounded">
										<Upload className="size-5" />
									</div>
									<h2 className="text-lg">Upload Files</h2>
								</AccordionTrigger>
								<AccordionContent className="flex flex-col gap-2">
									<p className="text-muted-foreground">Files will be in the session's Uploads folder.</p>
									<Input
										type="file"
										onChange={(e) => {
											const [file] = e.target.files || [];
											if (file)
												file.arrayBuffer().then((buffer) => {
													toast.promise(
														() =>
															fetch(`/api/session/${params.slug}/files?name=${file.name}`, {
																method: "PUT",
																body: buffer,
															}),
														{
															loading: "Uploading file...",
															success: "File uploaded",
															error: "Failed to upload file",
														},
													);
												});
										}}
									/>
								</AccordionContent>
							</AccordionItem>
							<AccordionItem value="vncOptions">
								<AccordionTrigger>
									<div className="p-2 rounded">
										<MonitorUp className="size-5" />
									</div>
									<h2 className="text-lg">VNC Options</h2>
								</AccordionTrigger>
								<AccordionContent className="flex flex-col gap-4">
									<div className="flex flex-col items-start gap-2">
										<Label htmlFor="viewonly">View Only</Label>
										<Switch id="viewonly" checked={viewOnly} onCheckedChange={setViewOnly} />
									</div>
									<div className="flex flex-col items-start gap-2">
										<Label htmlFor="clipToWindow">Clip to Window</Label>
										<Switch id="clipToWindow" checked={clipViewport} onCheckedChange={setClipViewport} />
									</div>
									<div className="flex flex-col items-start gap-2">
										<Label htmlFor="quality">Quality ({qualityLevel})</Label>
										<Slider
											id="quality"
											value={[qualityLevel]}
											onValueChange={([v]) => setQualityLevel(v)}
											min={0}
											max={9}
											className="my-1"
										/>
									</div>
									<div className="flex flex-col items-start gap-2">
										<Label htmlFor="compression">Compression ({compressionLevel})</Label>
										<Slider
											id="compression"
											value={[compressionLevel]}
											onValueChange={([v]) => setCompressionLevel(v)}
											min={0}
											max={9}
											className="my-1"
										/>
									</div>
									<div className="flex flex-col items-start gap-2">
										<Label htmlFor="scale">Scaling</Label>
										<Select value={scaling} onValueChange={setScaling as (v: ScalingValues) => void}>
											<SelectTrigger id="scale">
												<SelectValue placeholder={scaling} />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="remote">Remote Resizing</SelectItem>
												<SelectItem value="local">Local Scaling</SelectItem>
												<SelectItem value="none">None</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</AccordionContent>
							</AccordionItem>
						</Accordion>
					</div>
				</SheetContent>
			</Sheet>
			{session ? (
				session.exists ? (
					session.url && session.password ? (
						!session.paused ? (
							<Suspense fallback={<Loading text="Loading" />}>
								<VncScreen
									url={session.url}
									loader={<Loading text="Connecting" />}
									onClipboard={(e) => {
										if (e?.detail.text) {
											setClipboard(e.detail.text);
											navigator.clipboard.writeText(e.detail.text).catch(() => setWorkingClipboard(false));
										}
									}}
									onConnect={() => {
										setConnected(true);
										toast.success(`Connected to session ${params.slug.slice(0, 6)}`);
									}}
									onDisconnect={() => {
										setConnected(false);
										setSidebarOpen(false);
									}}
									onSecurityFailure={() => {
										setSession(null);
										setSidebarOpen(false);
									}}
									ref={vncRef}
									rfbOptions={{
										credentials: {
											username: "",
											password: session.password,
											target: "",
										},
									}}
									focusOnClick
									className="absolute z-20 h-screen w-screen overflow-clip"
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
											manageSession(params.slug, "unpause");
											toast.info("Session unpaused");
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
				<Loading text="Authenticating" />
			)}
		</div>
	);
}
