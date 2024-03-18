"use client";
import { signIn } from "next-auth/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Discord, GitHub } from "@/components/icons";

export default function Login() {
	const loginProviders = [
		{
			id: "github",
			name: "GitHub",
			signIn: () => signIn("github"),
			icon: <GitHub className="h-6 w-6" />,
		},
		{
			id: "discord",
			name: "Discord",
			signIn: () => signIn("discord"),
			icon: <Discord className="h-6 w-6" />,
		},
	];
	return (
		<main className="mx-auto flex min-h-screen items-center justify-center">
			<Card className="mx-auto flex h-[48rem] w-96 flex-col items-center justify-center p-0">
				<h2 className="text-3xl font-bold text-text-primary">
					Login to your account
				</h2>
				<section className="flex flex-col items-center justify-center gap-4 p-6">
					{loginProviders.map((provider) => (
						<Button
							key={provider.id}
							onClick={provider.signIn}
							className="w-full"
						>
							<div className="flex items-center justify-center gap-4">
								{provider.icon}
								<span>{provider.name}</span>
							</div>
						</Button>
					))}
				</section>
			</Card>
		</main>
	);
}
