import crypto from "node:crypto";
/* This is not for the end user and is meant for compatibility with https://holyubofficial.net/'s authentication backend
 */
import Credentials from "next-auth/providers/credentials";
import postgres from "postgres";
import { getConfig } from "./config";
interface UserModel {
	id: number;
	email: string;
	email_verified: boolean;
	email_verification_code: string | null;
	password_hash: string;
	admin: boolean;
	paid_until: Date;
	stripe_customer: string;
	signup_timestamp: Date;
	signup_ip: string;
	new_email: string | null;
	new_email_verification_secret: string | null;
	password_verification_secret: string | null;
	totp_secret: string | null;
	totp_enabled: Date | null;
	totp_backup_code: string | null;
	discord_id: string | null;
	discord_username: string | null;
	discord_avatar: string | null;
	discord_name: string | null;
	discord_updated: Date | null;
}
const { auth: authConfig } = getConfig();
function verify(password: string, hash: string) {
	const [salt, key] = hash.split(":");
	const keyBuffer = Buffer.from(key, "hex");

	return new Promise<boolean>((resolve, reject) => {
		crypto.scrypt(password, salt, 64, (err, derivedKey) => {
			if (err) reject(err);
			resolve(crypto.timingSafeEqual(keyBuffer, derivedKey));
		});
	});
}
export default Credentials({
	credentials: {
		email: {},
		password: {},
	},
	async authorize(credentials) {
		if (!credentials.email || !credentials.password) {
			throw new Error("Invalid credentials");
		}
		const sql = postgres(authConfig.credentials?.huDb as string);
		const [maybeUser] = await sql<UserModel[]>`SELECT * FROM users WHERE EMAIL = ${credentials.email as string}`;
		await sql.end({ timeout: 5 });
		if (!maybeUser) throw new Error("User not found");
		if (Date.now() > maybeUser.paid_until.getTime()) {
			throw new Error("User is not paid");
		}
		if (!maybeUser.email_verified) throw new Error("Email not verified");
		if (await verify(credentials.password as string, maybeUser.password_hash)) {
			return {
				image: maybeUser.discord_avatar,
				email: maybeUser.email,
				name: maybeUser.discord_name,
				id: maybeUser.id.toString(),
			};
		}
		await sql.end({ timeout: 5 });
		throw new Error("Invalid password");
	},
});
