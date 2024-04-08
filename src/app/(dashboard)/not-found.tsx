import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
	return (
		<div className="flex h-screen flex-col items-center justify-center">
			<Card className="flex h-[32rem] w-96 flex-col items-center justify-center">
				<CardHeader className="text-center">
					<CardTitle className="mb-4 flex items-center justify-center text-left text-2xl font-bold">
						<Sparkles />
						<span className="ml-2 text-2xl font-bold">Stardust</span>
					</CardTitle>
					<Image
						priority
						src="https://http.cat/404"
						alt="404"
						width={300}
						height={300}
						className="h-auto w-auto"
					/>
				</CardHeader>
				<CardContent className="flex flex-col items-center justify-center">
					<p className="text-center">
						The page you are looking for does not exist.
					</p>
					<Button className="mt-4 text-center" variant="link" asChild>
						<Link href="/">Go home</Link>
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
