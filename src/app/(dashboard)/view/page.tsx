import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
const VncScreen = dynamic(() => import("@/components/vnc-screen"), {
	ssr: false,
	loading: () => <Loader2 />,
});
export default function View() {
	return (
		<div className="flex items-center justify-center">
			<VncScreen
				url={`wss://tgtair.tail5e492.ts.net/api/websockify/jrbfru}`}
				className="scale-25 [&>*]:scale-25 mt-36 [&>*]:mt-36"
				rfbOptions={{
					credentials: {
						password: "vncpassword",
						username: "",
						target: "",
					},
				}}
			/>
		</div>
	);
}
