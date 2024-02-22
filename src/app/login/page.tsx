"use client";
import { signIn } from "next-auth/react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
export default function Login() {
	return (
		<main className="mx-auto flex min-h-screen items-center justify-center">
			<Card className="mx-auto flex h-96 w-[576px] flex-col items-center justify-center p-0">
				<h2 className="text-3xl font-bold text-text-primary">
					Welcome to Stardust
				</h2>
				<section className="flex flex-col items-center justify-center gap-4 p-6">
					<Input className="w-96 text-text-primary" placeholder="Email" />
					<Button
						className="w-48"
						variants={{ variant: "primary" }}
						onClick={(values: any) => {
							signIn("email", {
								...values,
							});
						}}
					>
						Send Magic Link
					</Button>
				</section>
			</Card>
		</main>
	);
}
