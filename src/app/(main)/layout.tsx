import Navigation from "@/components/navbar"
import { getAuthSession } from "@/lib/auth"
import { db, user as userSchema } from "@/lib/drizzle/db"
import { eq } from "drizzle-orm"
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
	const userSession = await getAuthSession()
	const dbUser = (
		await db
			.select()
			.from(userSchema)
			.where(eq(userSchema.email, userSession?.user?.email as string))
	)[0]
	return (
		<main className="h-[93vh]">
			<Navigation dbUser={dbUser} session={userSession} />
			{children}
		</main>
	)
}
