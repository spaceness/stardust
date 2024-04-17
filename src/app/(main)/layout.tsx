import Navigation from "@/components/navbar";
import authConfig from "@/lib/auth.config";
import { db, user as userSchema } from "@/lib/drizzle/db";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
	const userSession = await getServerSession(authConfig);
	const dbUser = (
		await db
			.select()
			.from(userSchema)
			.where(eq(userSchema.email, userSession?.user?.email as string))
	)[0];
	return (
		<main>
			<Navigation dbUser={dbUser} session={userSession} />
			{children}
		</main>
	);
}
