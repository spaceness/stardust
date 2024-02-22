import { Card } from "@/components/ui/card";
import { Link } from "@/components/ui/link";
export default function NotFound() {
	return (
		<main className="mx-auto flex min-h-screen items-center justify-center">
			<Card className="flex h-96 w-96 flex-col justify-center bg-bg-darker p-0">
				<section className="flex flex-col items-center justify-center gap-6 p-6 text-center sm:p-9">
					<h1 className="text-6xl text-white">404</h1>
					<h2 className="text-3xl font-bold text-white">Page not found</h2>
				</section>
				<section className="mx-auto flex w-48 flex-col items-center p-6 text-center">
					<Link href="/">Go back home</Link>
				</section>
			</Card>
		</main>
	);
}
