import VncScreen from "@/components/vnc-screen";

export default function View() {
	return (
		<div className="h-full w-full">
			<VncScreen url="ws://localhost:3000" />
		</div>
	);
}
