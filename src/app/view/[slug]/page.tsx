"use client";

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
import { deleteSession, manageSession } from "@/lib/session";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
	Camera,
	Clipboard,
	ClipboardCopy,
	Download,
	File,
	Files,
	HardDriveDownload,
	HardDriveUpload,
	Info,
	LogOut,
	Maximize,
	Minimize,
	MonitorUp,
	Pause,
	RotateCw,
	ScreenShareOff,
	Settings,
	Square,
	TrashIcon,
} from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";
type ScalingValues = "remote" | "local" | "none";
import { Loader2 } from "lucide-react";

function Loading({ text }: { text: string }) {
	return (
		<div className="h-40 w-96 bg-accent/50 rounded-lg border border-border/50 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 backdrop-blur-md flex items-center justify-center text-muted-foreground gap-3">
			<Loader2 className="animate-spin" />
			<h1 className="text-2xl font-bold">{text}</h1>
		</div>
	);
}
function ConnectionAlert({ text, error }: { text: string; error?: boolean }) {
	const Comp = error ? AlertCircle : Info;
	return (
		<div className="h-40 w-96 bg-accent/50 rounded-lg border border-border/50 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 backdrop-blur-md flex items-center justify-center text-muted-foreground gap-3">
			<Comp className={`${error && "text-destructive"}`} />
			<h1 className={`text-2xl ${error && "font-mono"} font-semibold`}>{text}</h1>
		</div>
	);
}
const VncScreen = dynamic(() => import("@/components/vnc-screen"), {
	loading: () => <Loading text="Loading" />,
});
export default function View(props: { params: Promise<{ slug: string }> }) {
	const params = use(props.params);
	const vncRef = useRef<VncViewerHandle>(null);
	const [connected, setConnected] = useState(false);
	const [fullScreen, setFullScreen] = useState(false);
	const [sidebarOpen, setSidebarOpen] = useState(false);
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
	const {
		data: session,
		error: sessionError,
		isLoading: sessionLoading,
		mutate: sessionMutate,
	} = useSWR<{
		exists: boolean;
		url: string | null;
		error?: string;
		password?: string;
	} | null>(`/api/session/${params.slug}`, fetcher, {
		onErrorRetry: (error, _key, _config, revalidate, { retryCount }) => {
			if (error.status === 404) return;
			setTimeout(() => revalidate({ retryCount }), 1000);
		},
	});
	const {
		data: filesList,
		error: filesError,
		isLoading: filesLoading,
		mutate: filesMutate,
	} = useSWR<string[]>(`/api/session/${params.slug}/files`, fetcher, {
		refreshInterval: 10000,
	});
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
	// why did i even use swr for this raaaaaaah
	useEffect(() => {
		if (!session) sessionMutate();
	}, [session, sessionMutate]);
	useEffect(() => {
		const requestClipboardPermissions = async () => {
			try {
				const result = await navigator.permissions.query({ name: "clipboard-write" as PermissionName });
				if (result.state === "granted") {
					setWorkingClipboard(true);
				} else {
					setWorkingClipboard(false);
				}
			} catch (error) {
				setWorkingClipboard(false);
			}
		};
		requestClipboardPermissions();
	}, []);
	useEffect(() => {
		const interval = setInterval(() => {
			if (workingClipboard && document.hasFocus()) {
				vncRef?.current?.rfb.focus();
				navigator.clipboard
					.readText()
					.then((text) => {
						if (text !== clipboard) {
							setClipboard(text);
							vncRef.current?.rfb.clipboardPasteFrom(text);
						}
					})
					.catch(() => setWorkingClipboard(false));
			}
		}, 2000);
		return () => clearInterval(interval);
	}, [clipboard, workingClipboard]);
	useEffect(() => {
		const interval = setInterval(() => {
			if (connected && document.hasFocus()) fetch(`/api/session/${params.slug}/keepalive`, { method: "POST" });
		}, 60000);
		return () => clearInterval(interval);
	}, [connected, params.slug]);
	useEffect(() => {
		if (document.fullscreenElement === null && fullScreen) {
			document.documentElement.requestFullscreen();
		} else if (document.fullscreenElement !== null && !fullScreen) {
			document.exitFullscreen();
		}
		const listener = () => setFullScreen(Boolean(document.fullscreenElement));
		document.addEventListener("fullscreenchange", listener);
		return () => document.removeEventListener("fullscreenchange", listener);
	}, [fullScreen]);
	return (
		<div className="h-screen w-screen justify-center items-center flex">
			{connected ? (
				<section className="flex flex-col gap-2 z-40 absolute -translate-y-1/2 left-0 top-1/2 rounded-r-md bg-background/80 p-[0.25rem] text-xs backdrop-blur-lg w-12">
					<Button variant="ghost" size="icon" onClick={() => setFullScreen(!fullScreen)}>
						{fullScreen ? <Minimize /> : <Maximize />}
					</Button>
					<Button variant="ghost" size="icon" hidden={sidebarOpen} onClick={() => setSidebarOpen((prev) => !prev)}>
						<Settings />
					</Button>
					<Button asChild size="icon" variant="ghost">
						<Link
							href={`/api/session/${params.slug}/preview`}
							download={`stardust-${params.slug.slice(0, 6)}-${new Date().toLocaleDateString("en-us")}`}
							target="_blank"
						>
							<Camera />
						</Link>
					</Button>
				</section>
			) : null}
			<Sheet
				open={sidebarOpen}
				onOpenChange={(value) => {
					setSidebarOpen(value);
					filesMutate();
				}}
			>
				<SheetContent side="left" className="w-2/5 overflow-y-auto">
					<SheetHeader>
						<SheetTitle className="text-2xl">Control Panel</SheetTitle>
					</SheetHeader>
					<section className="grid grid-cols-2 gap-3 py-2">
						<Button
							className="w-full"
							onClick={() => {
								setSidebarOpen(false);
								vncRef?.current?.rfb?.disconnect();
								router.push("/");
							}}
						>
							<ScreenShareOff className="mr-2 size-5 flex-shrink-0" />
							Disconnect
						</Button>
						<Button
							className="w-full"
							onClick={() =>
								toast.promise(
									async () => {
										await manageSession(params.slug, "pause");
										router.push("/");
									},
									{
										loading: "Pausing container...",
										success: "Session paused",
										error: "Failed to pause container",
									},
								)
							}
						>
							<Pause className="mr-2 size-5 flex-shrink-0" />
							Pause Session
						</Button>

						<Button
							className="w-full"
							onClick={() =>
								toast.promise(() => manageSession(params.slug, "restart"), {
									loading: "Restarting container...",
									success: "Session restarted",
									error: "Failed to restart container",
								})
							}
						>
							<RotateCw className="mr-2 size-5 flex-shrink-0" />
							Restart Session
						</Button>
						<Button
							className="w-full"
							onClick={() =>
								toast.promise(
									async () => {
										await manageSession(params.slug, "stop");
										router.push("/");
									},
									{
										loading: "Stopping container...",
										success: "Session stopped",
										error: "Failed to stop container",
									},
								)
							}
						>
							<Square className="mr-2 size-5 flex-shrink-0" />
							Stop Session
						</Button>
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button variant="destructive" className="w-full">
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
											toast.promise(
												async () => {
													await deleteSession(params.slug);
													router.push("/");
												},
												{
													loading: "Deleting session...",
													success: "Session deleted",
													error: "Failed to delete session",
												},
											);
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
					</section>
					<Accordion type="single" defaultValue="clipboard" className="w-full">
						<AccordionItem value="clipboard">
							<AccordionTrigger>
								<div className="flex items-center gap-4">
									<Clipboard className="h-9 w-9 rounded-md bg-accent p-1.5" /> Clipboard
								</div>
							</AccordionTrigger>
							<AccordionContent className="space-y-4">
								<Textarea
									className="h-48 w-full !ring-0 resize-none"
									tabIndex={-20}
									spellCheck={false}
									autoCorrect="off"
									autoCapitalize="off"
									value={clipboard}
									disabled={workingClipboard}
									placeholder="Paste here to send to remote machine"
									onChange={(e) => {
										if (vncRef.current?.rfb) {
											setClipboard(e.target.value);
											vncRef.current.clipboardPaste(e.target.value);
										}
									}}
								/>
								{!workingClipboard ? (
									<Button
										type="button"
										className="w-full"
										onClick={async () => {
											const text = await navigator.clipboard.readText().catch(() => {
												setWorkingClipboard(false);
												toast.error("Failed to read clipboard, did you deny clipboard permissions?");
											});
											if (text) {
												setClipboard(text);
												vncRef.current?.clipboardPaste(text);
												setWorkingClipboard(true);
											}
										}}
									>
										<ClipboardCopy className="mr-2 h-5 w-5" /> Request Clipboard
									</Button>
								) : null}
							</AccordionContent>
						</AccordionItem>
						<AccordionItem value="files">
							<AccordionTrigger>
								<div className="flex items-center gap-4">
									<Files className="h-9 w-9 rounded-md bg-accent p-1.5" /> Files
								</div>
							</AccordionTrigger>
							<AccordionContent>
								<div className="space-y-4">
									<Card className="border-dashed border-2">
										<CardHeader>
											<CardTitle className="text-lg">Downloads</CardTitle>
										</CardHeader>
										<CardContent className="flex flex-col gap-2">
											{!filesError ? (
												!filesLoading ? (
													filesList && filesList?.length > 0 ? (
														filesList.map((file) => (
															<Link
																key={file}
																download={file}
																href={{
																	pathname: `/api/session/${params.slug}/files`,
																	query: { name: file },
																}}
															>
																<Card className="flex justify-start items-center p-4 h-12 w-full gap-2 hover:bg-muted duration-150">
																	<File className="size-5 flex-shrink-0" />
																	<span className="text-sm truncate overflow-x-scroll">{file}</span>
																</Card>
															</Link>
														))
													) : (
														<p className="text-muted-foreground">
															Add files to the Downloads folder to download them here
														</p>
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
										</CardContent>
									</Card>
									<Button className="w-full" asChild>
										<Label htmlFor="file-input">
											<HardDriveUpload className="mr-2 h-5 w-5" /> Upload File
										</Label>
									</Button>
									<input
										type="file"
										className="hidden"
										id="file-input"
										onChange={async (e) => {
											const [file] = e.target.files || [];
											const buffer = await file.arrayBuffer();
											toast.promise(
												() =>
													fetch(`/api/session/${params.slug}/files?name=${file.name}`, {
														method: "PUT",
														body: buffer,
													}),
												{
													loading: "Uploading file...",
													success: "File uploaded",
													error: (error) => `Failed to upload file: ${error.message}`,
												},
											);
										}}
									/>
								</div>
							</AccordionContent>
						</AccordionItem>
						<AccordionItem value="vnc">
							<AccordionTrigger>
								<div className="flex items-center gap-4">
									<MonitorUp className="size-9 rounded-md bg-accent p-1.5" /> VNC Options
								</div>
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
				</SheetContent>
			</Sheet>
			{!sessionError ? (
				!sessionLoading ? (
					session?.exists && session.url && session.password ? (
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
							onSecurityFailure={() => sessionMutate(null)}
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
					) : (
						<ConnectionAlert text="Container not running" />
					)
				) : (
					<Loading text="Authenticating" />
				)
			) : (
				<ConnectionAlert error text={sessionError?.message} />
			)}
		</div>
	);
}
