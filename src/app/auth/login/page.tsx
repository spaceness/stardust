"use client";
import { useState } from "react";
import { useSearchParams, redirect } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, LogIn, AlertCircle } from "lucide-react";
export default function Login() {
	const searchParams = useSearchParams();
	const [loading, setLoading] = useState(false);
	const error = searchParams.get("error");
	const { data: session } = useSession();
	if (session) {
		redirect("/");
	}
	return (
		<CardContent className="m-2 w-full flex-col">
			{error && (
				<Alert variant="destructive" className="w-full text-destructive">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Error logging in:</AlertTitle>
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}
			<div className="mx-auto mt-4 flex w-full flex-col items-center justify-center gap-2">
				<Button
					disabled={loading}
					className="my-1 w-full"
					onClick={() => {
						setLoading(true);
						signIn("auth0");
					}}
				>
					{loading ? (
						<Loader2 className="mr-2 h-5 w-5 animate-spin" />
					) : (
						<LogIn className="mr-2 size-4" />
					)}
					{loading ? "Logging in" : "Log in with Auth0"}
				</Button>
			</div>
		</CardContent>
	);
}
