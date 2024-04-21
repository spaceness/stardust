"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import { AlertCircle, Loader2, LogIn } from "lucide-react"
import { signIn, useSession } from "next-auth/react"
import { redirect, useSearchParams } from "next/navigation"
import { useState } from "react"

export default function Login() {
	const searchParams = useSearchParams()
	const [loading, setLoading] = useState(false)
	const error = searchParams.get("error")
	const { data: session } = useSession()
	if (session) {
		redirect("/")
	}
	return (
		<CardContent className="m-2 w-full flex-col">
			{error ? (
				<Alert variant="destructive" className="w-full text-destructive">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Error logging in:</AlertTitle>
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			) : null}
			<div className="mx-auto mt-4 flex w-full flex-col items-center justify-center gap-2">
				<Button
					disabled={loading}
					className="my-1 w-full"
					onClick={() => {
						setLoading(true)
						signIn("auth0")
					}}
				>
					{loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <LogIn className="mr-2 size-4" />}
					{loading ? "Logging in" : "Log in with Auth0"}
				</Button>
			</div>
		</CardContent>
	)
}
