"use client";

import { deleteSession, manageSession } from "@/actions/client-session";
import ModeToggle from "@/components/mode-toggle";
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

import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { VncViewerHandle } from "@/components/vnc-screen";
import { ChevronRight, LogOut, LucideHome, Pause, Sparkles, TrashIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
type ScalingValues = "remote" | "local" | "none";
const Loading = ({ text }: { text: string }) => (
	<div className="flex h-screen flex-col items-center justify-center gap-2">
		<Sparkles className="size-12 animate-pulse" />
		<h1 className="text-xl font-semibold">{text}</h1>
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
	const [connected, setConnected] = useState(false);
	const [pausing, setPausing] = useState(false);
	// noVNC options start
	const [clipboard, setClipboard] = useState<string>("");
	const [viewOnly, setViewOnly] = useState(false);
	const [qualityLevel, setQualityLevel] = useState(6);
	const [compressionLevel, setCompressionLevel] = useState(2);
	const [clipViewport, setClipViewport] = useState(false);
	const [scaling, setScaling] = useState<ScalingValues>("remote");
	// noVNC options end
	useEffect(() => {
		try {
			fetch(`/api/vnc/${params.slug}`)
				.then((res) => res.json())
				.then((data) => {
					if (data.exists) {
						setSession({ exists: true, url: `/api/vnc/${params.slug}`, paused: data.paused ?? false });
					} else {
						setSession({ exists: false, url: null });
					}
				});
		} catch (error) {
			throw new Error(error as any);
		}
	}, [params.slug]);
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
	useEffect(() => {
		const interval = setInterval(() => {
			if (connected && vncRef.current?.rfb) {
				fetch("/api/session/preview", {
					method: "POST",
					body: JSON.stringify({ imagePreview: vncRef.current.rfb?.toDataURL(), containerId: params.slug }),
				});
			}
		}, 10000);
		return () => clearInterval(interval);
	}, [connected, params.slug]);
	// fix input not working when you unfocus sometimes
	useEffect(() => {
		const interval = setInterval(() => {
			if (session?.exists && vncRef.current?.rfb) {
				vncRef.current?.rfb?.focus();
			}
		}, 250);
		return () => clearInterval(interval);
	}, [session]);
	return (
		<div className="overflow-none flex h-screen w-full flex-grow justify-center">
			{connected ? (
				<Sheet>
					{/* <Draggable axis="y" defaultPosition={{ x: 0, y: 0 }} scale={1} bounds="parent" grid={[25, 25]}> */}
					<SheetTrigger asChild>
						<Button
							size="icon"
							className="absolute left-0 right-2 top-1/2 z-40 h-16 w-8 rounded-l-none border-l-0 backdrop-blur-md"
						>
							<ChevronRight />
						</Button>
					</SheetTrigger>
					{/* </Draggable> */}

					<SheetContent side="left">
						<SheetTitle className="py-2 text-3xl">Settings</SheetTitle>
						<SheetHeader>
							<SheetTitle>Clipboard</SheetTitle>
							<SheetDescription>Contents of the clipboard will be shared with the remote machine.</SheetDescription>
						</SheetHeader>
						<div className="grid gap-4 py-4">
							<Textarea
								className="h-32 w-full"
								value={clipboard}
								onChange={(e) => {
									if (vncRef.current?.rfb) {
										setClipboard(e.target.value);
										vncRef.current.rfb.clipboardPasteFrom(clipboard);
									}
								}}
							/>
							<section className="flex flex-col gap-4">
								<h1 className="text-xl font-bold">VNC Options</h1>
								<div className="flex items-center gap-2">
									<Label htmlFor="viewonly">View Only</Label>
									<Switch id="viewonly" checked={viewOnly} onCheckedChange={setViewOnly} />
								</div>
								<div className="flex items-center gap-2">
									<Label htmlFor="clipToWindow">Clip to Window</Label>
									<Switch id="clipToWindow" checked={clipViewport} onCheckedChange={setClipViewport} />
								</div>
								<div className="flex items-center gap-2">
									<Label htmlFor="quality">Quality</Label>
									<Slider
										id="quality"
										value={[qualityLevel]}
										onValueChange={(v) => setQualityLevel(v[0])}
										min={0}
										max={9}
									/>
								</div>
								<div className="flex items-center gap-2">
									<Label htmlFor="compression">Compression</Label>
									<Slider
										id="compression"
										value={[compressionLevel]}
										onValueChange={(v) => setCompressionLevel(v[0])}
										min={0}
										max={9}
									/>
								</div>
								<div className="flex items-center gap-2">
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
								<Button
									onClick={() => {
										if (vncRef.current?.rfb)
											vncRef.current.rfb.toBlob((blob) => {
												const url = URL.createObjectURL(blob);
												const link = document.createElement("a");
												link.href = url;
												link.download = `screenshot-${params.slug.slice(0, 7)}-${new Date(Date.now()).toLocaleString()}.png`;
												link.click();
												URL.revokeObjectURL(url);
												toast.success("Screenshot taken");
											});
									}}
								>
									Take Screenshot
								</Button>
							</section>
						</div>
						<Separator className="my-2" />
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
												vncRef.current?.rfb?.disconnect();
												setPausing(true);
												setSession(null);
												manageSession(params.slug, "pause", true);
												toast.warning(`Session paused`);
											}}
										>
											<Pause />
										</Button>
									</TooltipTrigger>
									<TooltipContent>{session?.paused ? "Resume" : "Pause"} Session</TooltipContent>
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
													toast.error("Session deleted");
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
							<ModeToggle />
						</section>
					</SheetContent>
				</Sheet>
			) : null}
			{session ? (
				session.exists ? (
					session.url ? (
						!session.paused ? (
							<Suspense fallback={<Loading text="Loading" />}>
								<VncScreen
									url={session.url}
									loader={<Loading text="Connecting" />}
									onClipboard={(e) => {
										if (e?.detail.text) setClipboard(e.detail.text);
									}}
									onConnect={(rfb) => {
										setConnected(true);
										toast.success("Connected to session");
										if (rfb) {
											rfb.focus();
										}
									}}
									onDisconnect={() => setConnected(false)}
									ref={vncRef}
									rfbOptions={{
										credentials: {
											username: "",
											password: "stardustVnc123",
											target: "",
										},
									}}
									focusOnClick
									className="absolute h-screen w-screen overflow-clip"
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
				<Loading text={pausing ? "Loading" : "Authenticating"} />
			)}
		</div>
	);
}
