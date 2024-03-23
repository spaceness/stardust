import VncScreen from "@/components/vnc-screen";

export default function View() {
	return (
		<div className="flex h-full w-full items-center justify-center">
			<VncScreen
				url="ws://localhost:3000"
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
