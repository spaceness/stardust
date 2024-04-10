"use client";

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
import { ChevronRight, Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";

const Loading = () => (
	<Loader2 className="flex h-screen animate-spin items-center justify-center" />
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
		<div className="flex h-screen w-full flex-grow justify-center">
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
						<SheetDescription>
							Contents of the clipboard will be shared with the remote machine.
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
	);
}
