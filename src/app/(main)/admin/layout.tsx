import authConfig from "@/lib/auth.config";
import { db, user } from "@/lib/drizzle/db";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
	const userSession = await getServerSession(authConfig);
	const { isAdmin } = (
		await db
			.select({ isAdmin: user.isAdmin })
			.from(user)
			.where(eq(user.email, userSession?.user?.email as string))
	)[0];
	if (!isAdmin) {
		return redirect("/");
	}
	return children;
}
