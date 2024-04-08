import ModeToggle from "@/components/mode-toggle";
import { Card, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export default function LoginLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<main className="min-h-screen bg-background bg-dotted-spacing-5 bg-dotted-secondary">
			<section className="flex min-h-screen items-center justify-center">
				<Card className="mx-auto flex min-h-72 w-96 flex-col items-center justify-center bg-foreground/10 py-12 backdrop-blur-md">
					<CardTitle className="mb-4 flex items-center justify-center text-left text-2xl font-bold">
						<Sparkles />
						<span className="ml-2 text-2xl font-bold">Stardust</span>
					</CardTitle>
					{children}
				</Card>
			</section>
			<div>
				<ModeToggle className="fixed bottom-2 right-2 bg-foreground/10 backdrop-blur-md" />
			</div>
		</main>
	);
}
