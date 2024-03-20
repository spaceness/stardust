"use client";
import { useState } from "react";
import { useSearchParams, redirect } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Auth0 } from "@/components/icons";
import { Loader2 } from "lucide-react";
export default function Login() {
	const searchParams = useSearchParams();
	const [loading, setLoading] = useState(false);
	const error = searchParams.get("error");
	const { data: session } = useSession();
	if (session) {
		redirect("/");
	}
	const signinProviders: {
		name: string;
		icon: JSX.Element;
		signin: () => void;
	}[] = [
		{
			name: "Auth0",
			icon: <Auth0 className="mr-2 size-5" />,
			signin: () => signIn("auth0"),
		},
	];
	return (
		<CardContent className="m-2 w-full flex-col">
			{error && (
				<div className="text-md rounded-md bg-destructive p-3 text-destructive-foreground">
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
	);
}
