"use server";
import { signIn } from "@/lib/auth";
import { getConfig } from "@/lib/config";
import type { UserModel } from "@/lib/hu-provider";
import turnstileCheck from "@/lib/turnstile";
import type { CredentialsSignin } from "next-auth";
import { redirect } from "next/navigation";
import { authenticator } from "otplib";
import postgres from "postgres";
export async function logIn(data: FormData) {
	try {
		if (await turnstileCheck(data)) {
			await signIn("credentials", data);
		} else {
			throw new Error("Failed captcha");
		}
	} catch (error) {
		redirect(`/auth/login?error=${(error as CredentialsSignin).cause?.err?.message || (error as Error).message}`);
	}
}
export async function otpCheck(data: FormData) {
	if (data.has("otp")) return true;
	const sql = postgres(getConfig().auth.huDb as string);
	const [user] = await sql<UserModel[] | undefined[]>`SELECT * FROM users WHERE EMAIL = ${data.get("email") as string}`;
	await sql.end();
	return Boolean(user?.totp_enabled);
}
export async function checkCode(data: FormData, code: string) {
	const sql = postgres(getConfig().auth.huDb as string);
	const [user] = await sql<UserModel[] | undefined[]>`SELECT * FROM users WHERE EMAIL = ${data.get("email") as string}`;
	await sql.end();
	return authenticator.verify({
		token: code,
		secret: user.totp_secret || "",
	});
}
