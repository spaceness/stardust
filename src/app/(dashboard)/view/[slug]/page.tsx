"use client";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
const VncScreen = dynamic(() => import("@/components/vnc-screen"), {
	ssr: false,
	loading: () => <Loader2 />,
});
export default function View({ params }: { params: { slug: string } }) {
	return (
		<div className="flex items-center justify-center">
			<VncScreen
				url={`/api/websockify/${params.slug}`}
				className="scale-25 [&>*]:scale-25"
				rfbOptions={{
					credentials: {
						username: "",
						password: "stardustVnc123",
						target: "",
					},
				}}
			/>
		</div>
	);
}
