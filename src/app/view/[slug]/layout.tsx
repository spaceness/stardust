import type { Metadata } from "next";
export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
	return {
		title: `Session ${params.slug.slice(0, 6)}`,
	};
}
export default function ViewLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
