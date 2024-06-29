import { StyledSubmit } from "@/components/submit-button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CardContent } from "@/components/ui/card";
import { auth, signIn } from "@/lib/auth";
import { providers } from "@/lib/auth.config";
import { AlertCircle } from "lucide-react";
import { redirect } from "next/navigation";

export default async function Login({
	searchParams,
}: {
	searchParams: { [key: string]: string | string[] | undefined };
}) {
	const session = await auth();
	if (session) redirect("/");
	const { error } = searchParams;
	const providersArray = process.env.AUTH_PROVIDERS?.split(",").filter(Boolean) || [];
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
				{providersArray.map((provider) => {
					const { Icon } = providers[provider];
					return (
						<form
							key={provider}
							className="w-full"
							action={async () => {
								"use server";
								await signIn(provider);
							}}
						>
							<StyledSubmit className="my-1 w-full">
								<Icon className="mr-2 size-4" />
								Log in with {provider.charAt(0).toUpperCase() + provider.slice(1)}
							</StyledSubmit>
						</form>
					);
				})}
			</div>
		</CardContent>
	);
}
