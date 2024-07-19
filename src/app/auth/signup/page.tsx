import { StyledSubmit } from "@/components/submit-button";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth } from "@/lib/auth";
import { getConfig } from "@/lib/config";
import { db, user } from "@/lib/drizzle/db";
import { createId } from "@paralleldrive/cuid2";
import { hash } from "argon2";
import { Info } from "lucide-react";
import { redirect } from "next/navigation";

export default async function Page({
	searchParams,
}: {
	searchParams: { [key: string]: string | string[] | undefined };
}) {
	const session = await auth();
	if (session) redirect("/");
	const config = getConfig();
	const { message } = searchParams;
	if (!config.auth.credentials || !config.auth.credentials.signups)
		redirect(`/auth/error?error=${encodeURIComponent("Signups are disabled for this instance.")}`);
	return (
		<CardContent className="m-1 w-full flex-col flex justify-center items-center">
			<CardDescription>Create an account</CardDescription>
			{message ? (
				<Alert className="w-full my-4">
					<Info className="h-4 w-4" />
					<AlertTitle>{message}</AlertTitle>
				</Alert>
			) : null}
			<form
				className="mx-auto mb-4 flex w-full flex-col items-start justify-center gap-2"
				action={async (data) => {
					"use server";
					const userCheck = await db.query.user.findFirst({
						where: (user, { eq }) => eq(user.email, data.get("email")?.toString() || ""),
					});
					if (userCheck) redirect("/auth/login?error=Email%20already%20in%20use");
					await db.insert(user).values({
						name: data.get("name")?.toString(),
						email: data.get("email")?.toString() as string,
						password: await hash(data.get("password")?.toString() as string),
						id: createId(),
					});
					redirect("/auth/login?message=Account%20created%20successfully");
				}}
			>
				<Label htmlFor="name">Name</Label>
				<Input id="name" type="text" name="name" placeholder="Name" autoComplete="name" className="w-full" />
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
					autoComplete="new-password"
					required
					className="w-full"
				/>
				<StyledSubmit className="w-full">Sign up</StyledSubmit>
			</form>
		</CardContent>
	);
}
