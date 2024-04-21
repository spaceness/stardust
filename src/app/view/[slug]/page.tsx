"use client"

import { deleteSession, manageSession } from "@/actions/client-session"
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
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { VncViewerHandle } from "@/components/vnc-screen"
import {
	Camera,
	ChevronRight,
	LogOut,
	LucideHome,
	Maximize,
	Minimize,
	Pause,
	RotateCw,
	Sparkles,
	TrashIcon,
} from "lucide-react"
import Link from "next/link"
import { notFound, useSearchParams } from "next/navigation"
import { Suspense, lazy, useEffect, useRef, useState } from "react"
import { toast } from "sonner"
type ScalingValues = "remote" | "local" | "none"
const Loading = ({ text }: { text: string }) => (
	<div className="flex h-screen flex-col items-center justify-center gap-2 bg-secondary/10 p-24 backdrop-blur-sm">
		<Sparkles className="size-12 animate-pulse" />
		<h1 className="text-xl font-semibold">{text}</h1>
	</div>
)
const VncScreen = lazy(() => import("@/components/vnc-screen"))
export default function View({ params }: { params: { slug: string } }) {
	const vncRef = useRef<VncViewerHandle>(null)
	const [session, setSession] = useState<{
		exists: boolean
		url: string | null
		paused?: boolean
	} | null>(null)
	const [connected, setConnected] = useState(false)
	const [pausing, setPausing] = useState(false)
	const [fullScreen, setFullScreen] = useState(false)
	const [sidebarOpen, setSidebarOpen] = useState(false)
	const [workingClipboard, setWorkingClipboard] = useState(true)
	// noVNC options start
	const [clipboard, setClipboard] = useState<string>("")
	const [viewOnly, setViewOnly] = useState(false)
	const [qualityLevel, setQualityLevel] = useState(6)
	const [compressionLevel, setCompressionLevel] = useState(2)
	const [clipViewport, setClipViewport] = useState(false)
	const [scaling, setScaling] = useState<ScalingValues>("remote")
	// noVNC options end
	const searchParams = useSearchParams()
	useEffect(() => {
		try {
			if (searchParams.get("nocheck") === "true") {
				setSession({ exists: true, url: `/api/vnc/${params.slug}` })
			} else {
				fetch(`/api/vnc/${params.slug}`)
					.then((res) => res.json())
					.then((data) => {
						if (data.exists) {
							setSession({ exists: true, url: `/api/vnc/${params.slug}`, paused: data.paused ?? false })
						} else {
							setSession({ exists: false, url: null })
						}
					})
			}
		} catch (error) {
			throw new Error(error as string)
		}
	}, [params.slug, searchParams])
	useEffect(() => {
		if (connected && vncRef.current?.rfb) {
			vncRef.current.rfb.viewOnly = viewOnly
			vncRef.current.rfb.qualityLevel = qualityLevel
			vncRef.current.rfb.compressionLevel = compressionLevel
			vncRef.current.rfb.clipViewport = clipViewport
			vncRef.current.rfb.resizeSession = scaling === "remote"
			vncRef.current.rfb.scaleViewport = scaling === "local"
		}
	}, [connected, viewOnly, qualityLevel, compressionLevel, scaling, clipViewport])
	// jank, but it works ¯\_(ツ)_/¯
	useEffect(() => {
		const interval = setInterval(() => {
			if (connected && vncRef.current?.rfb && document.hasFocus()) {
				vncRef.current.rfb.focus()
				navigator.clipboard
					.readText()
					.then((text) => {
						if (text !== clipboard) {
							setWorkingClipboard(true)
							vncRef.current?.clipboardPaste(text)
							setClipboard(text)
						}
					})
					.catch(() => setWorkingClipboard(false))
			}
		}, 250)
		return () => clearInterval(interval)
	}, [connected, clipboard])
	useEffect(() => {
		const interval = setInterval(() => {
			if (connected && vncRef.current?.rfb) {
				fetch("/api/session/preview", {
					method: "POST",
					body: JSON.stringify({ imagePreview: vncRef.current.rfb?.toDataURL(), containerId: params.slug }),
				})
			}
		}, 10000)
		return () => clearInterval(interval)
	}, [connected, params.slug])
	useEffect(() => {
		if (document.fullscreenElement === null && fullScreen) {
			document.documentElement.requestFullscreen()
		} else if (document.fullscreenElement !== null && !fullScreen) {
			document.exitFullscreen()
		}
	}, [fullScreen])
	return (
		<div className="h-screen w-screen">
			{connected ? (
				<Button
					size="icon"
					className={`absolute left-0 right-2 top-1/2 z-40 h-16 w-8 rounded-l-none border-l-0 bg-primary/70 backdrop-blur-md ${
						sidebarOpen && "hidden"
					}`}
					onClick={() => setSidebarOpen((prev) => !prev)}
				>
					<ChevronRight />
				</Button>
			) : null}
			<Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
				<SheetContent side="left" className="z-50 flex flex-col overflow-auto bg-background/75 backdrop-blur-lg">
					<SheetTitle className="py-2 text-3xl">Settings</SheetTitle>
					<SheetHeader>
						<SheetTitle>Clipboard</SheetTitle>
						<SheetDescription>Contents of the clipboard will be shared with the remote machine.</SheetDescription>
					</SheetHeader>
					<div className="flex flex-col gap-4 pt-4">
						<Textarea
							className="h-32 w-full"
							tabIndex={-20}
							value={!workingClipboard ? clipboard : undefined}
							disabled={workingClipboard}
							placeholder={workingClipboard ? "Clipboard is already synced" : "Paste here to send to remote machine"}
							onChange={(e) => {
								if (vncRef.current?.rfb) {
									setClipboard(e.target.value)
									vncRef.current.clipboardPaste(e.target.value)
								}
							}}
						/>
						<SheetTitle>VNC Options</SheetTitle>
						<section className="flex flex-col gap-4">
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
							<Button
								onClick={() => {
									if (vncRef.current?.rfb)
										vncRef.current.rfb.toBlob((blob) => {
											const url = URL.createObjectURL(blob)
											const link = document.createElement("a")
											link.href = url
											link.download = `screenshot-${params.slug.slice(0, 7)}-${new Date(
												Date.now(),
											).toLocaleString()}.png`
											link.click()
											URL.revokeObjectURL(url)
										})
								}}
							>
								<Camera className="mr-2 size-5" />
								Take Screenshot
							</Button>
							<Button onClick={() => setFullScreen(!fullScreen)}>
								{fullScreen ? (
									<>
										<Minimize className="mr-2 size-5" />
										Exit Fullscreen
									</>
								) : (
									<>
										<Maximize className="mr-2 size-5" />
										Enter Fullscreen
									</>
								)}
							</Button>
						</section>
					</div>
					<Separator className="my-4" />
					<section className="flex justify-between">
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
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										size="icon"
										variant="outline"
										onClick={() => {
											vncRef.current?.rfb?.disconnect()
											setPausing(true)
											setSession(null)
											toast.promise(() => manageSession(params.slug, "pause", true), {
												loading: "Pausing container...",
												success: "Session paused",
												error: "Failed to pause container",
											})
										}}
									>
										<Pause />
									</Button>
								</TooltipTrigger>
								<TooltipContent>Pause Session</TooltipContent>
							</Tooltip>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										size="icon"
										variant="outline"
										onClick={() => {
											toast.promise(() => manageSession(params.slug, "restart", false), {
												loading: "Restarting container...",
												success: "Session restarted",
												error: "Failed to restart container",
											})
										}}
									>
										<RotateCw className="size-5" />
									</Button>
								</TooltipTrigger>
								<TooltipContent>Restart</TooltipContent>
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
										<AlertDialogDescription>Are you 100% sure you want to delete this session?</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>Cancel</AlertDialogCancel>
										<AlertDialogAction
											onClick={() => {
												setSession(null)
												toast.promise(() => deleteSession(params.slug), {
													loading: "Deleting session...",
													success: "Session deleted",
													error: "Failed to delete session",
												})
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
			{session ? (
				session.exists ? (
					session.url ? (
						!session.paused ? (
							<Suspense fallback={<Loading text="Loading" />}>
								<VncScreen
									url={session.url}
									loader={<Loading text="Connecting" />}
									onClipboard={(e) => {
										if (e?.detail.text) {
											setClipboard(e.detail.text)
											navigator.clipboard.writeText(e.detail.text).catch(() => setWorkingClipboard(false))
										}
									}}
									onConnect={() => {
										setConnected(true)
										toast.success(`Connected·to·session·${params.slug.slice(0, 7)}`)
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
											setSession({ ...session, paused: false })
											manageSession(params.slug, "unpause", false)
											toast.info("Session unpaused")
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
	)
}
