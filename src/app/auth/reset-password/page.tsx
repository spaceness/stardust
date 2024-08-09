import { auth } from "@/lib/auth";
import { getConfig } from "@/lib/config";
import { db } from "@/lib/drizzle/db";
import { redirect } from "next/navigation";
import ClientPage from "./page.client";
export default async function Page() {
	const config = getConfig();
	if (config.auth.huDb) redirect(`${config.auth.huUrl || "https://holyubofficial.net"}/pro/change-password`);
	const userSession = await auth();
	const authUser = await db.query.user.findFirst({
		where: (user, { eq }) => eq(user.id, userSession?.user.id as string),
	});
	return <ClientPage authUser={authUser} />;
}
