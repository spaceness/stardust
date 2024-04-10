import Navigation from "@/components/navbar";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<main>
			<Navigation />
			{children}
		</main>
	);
}
