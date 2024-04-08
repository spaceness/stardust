"use client";

import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";

const VncScreen = dynamic(() => import("@/components/vnc-screen"), {
	ssr: false,
	loading: () => (
		<Loader2 className="animate-spin items-center justify-center" />
	),
});
export default function View({ params }: { params: { slug: string } }) {
	const [session, setSession] = useState<{
		exists: boolean;
		url: string | null;
	} | null>(null);
	useEffect(() => {
		fetch(`/api/websockify/${params.slug}`)
			.then((res) => res.json())
			.then((data) => {
				if (data.exists) {
					setSession({ exists: true, url: params.slug });
				} else {
					setSession({ exists: false, url: null });
				}
			});
	}, [params.slug]);
	return (
		<div className="flex h-screen items-center justify-center">
			{session && session.exists ? (
				session.url ? (
					<VncScreen
						url={session.url}
						className="scale-25 [&>*]:scale-25"
						loader={
							<Loader2 className="animate-spin items-center justify-center" />
						}
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
			)}
		</div>
	);
}
