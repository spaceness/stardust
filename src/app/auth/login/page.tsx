"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Discord, GitHub } from "@/components/icons";
import { Loader2, Sparkles } from "lucide-react";
export default function Login() {
	const searchParams = useSearchParams();
	const [loading, setLoading] = useState(false);
	const error = searchParams.get("error");
	const signinProviders: {
		name: string;
		icon: JSX.Element;
		signin: () => void;
	}[] = [
		{
			name: "GitHub",
			icon: <GitHub className="mr-2 size-5" />,
			signin: () => signIn("github"),
		},
		{
			name: "Discord",
			icon: <Discord className="mr-2 size-5" />,
			signin: () => signIn("discord"),
		},
	];
	return (
		<Card className="mx-auto flex h-[28rem] w-96 flex-col items-center justify-center">
			<CardTitle className="mb-4 flex items-center justify-center text-left text-2xl font-bold">
				<Sparkles />
				<span className="ml-2 text-2xl font-bold">Stardust</span>
			</CardTitle>
			<CardContent className="m-2 w-full flex-col">
				{error && (
					<div className="text-md m-2 rounded-md bg-destructive p-3">
						There was an error: {error}
					</div>
				)}
				<div className="mx-auto mt-4 flex w-full flex-col items-center justify-center gap-2">
					{signinProviders.map((provider) => (
						<Button
							disabled={loading}
							key={provider.name}
							className="my-1 w-full"
							onClick={() => {
								setLoading(true);
								provider.signin();
							}}
						>
							{loading ? (
								<Loader2 className="mr-2 h-5 w-5 animate-spin" />
							) : (
								provider.icon
							)}
							{provider.name}
						</Button>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
