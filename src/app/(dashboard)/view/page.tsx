import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
const VncScreen = dynamic(() => import("@/components/vnc-screen"), {
	ssr: false,
	loading: () => <Loader2 />,
});
export default function View() {
	return (
		<div className="flex h-full w-full items-center justify-center">
			<VncScreen
				url={`ws://localhost:3001/api/websockify/jrbfru}`}
				rfbOptions={{
					credentials: {
						password: "stardustVnc123",
						username: "",
						target: "",
					},
				}}
				className="mt-36 flex h-full w-full items-center justify-center"
			/>
		</div>
	);
}
