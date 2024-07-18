import { StyledSubmit } from "@/components/submit-button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { auth, signIn } from "@/lib/auth";
import { providers } from "@/lib/auth.config";
import { getConfig } from "@/lib/config";
import type { AuthConfig } from "@/types/config";
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
	const config = getConfig();
	return (
		<CardContent className="m-1 w-full flex-col flex justify-center">
			{error ? (
				<Alert variant="destructive" className="w-full text-destructive">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Error logging in:</AlertTitle>
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			) : null}
			<form className="mx-auto mb-4 flex w-full flex-col items-start justify-center gap-2">
				<Label htmlFor="email">Email</Label>
				<Input
					id="email"
					type="email"
					name="email"
					placeholder="Email"
					autoComplete="email"
					required
					className="w-full"
				/>
				<Label htmlFor="password">Password</Label>
				<Input
					id="password"
					type="password"
					name="password"
					placeholder="Password"
					autoComplete="current-password"
					required
					className="w-full"
				/>
				<StyledSubmit className="w-full">Log in</StyledSubmit>
			</form>
			{config.auth.oauth ? (
				<>
					<span className="text-center text-sm text-muted-foreground">Or log in with:</span>
					<div className="mx-auto mt-4 flex w-full flex-row items-center justify-center gap-2 flex-wrap">
						{Object.keys(config.auth.oauth.providers).map((provider) => {
							const { Icon } = providers[provider as keyof typeof providers];
							return (
								<form
									key={provider}
									action={async () => {
										"use server";
										await signIn(provider);
									}}
								>
									<Tooltip>
										<TooltipContent>{provider.charAt(0).toLocaleUpperCase() + provider.slice(1)}</TooltipContent>
										<TooltipTrigger asChild>
											<StyledSubmit pendingSpinner variant="outline" size="icon">
												<Icon className="size-[1.2rem]" />
											</StyledSubmit>
										</TooltipTrigger>
									</Tooltip>
								</form>
							);
						})}
					</div>
				</>
			) : null}
		</CardContent>
	);
}
