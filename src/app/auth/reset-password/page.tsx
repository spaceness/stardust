import { auth } from "@/lib/auth";
import { db } from "@/lib/drizzle/db";
import ClientPage from "./page.client";
export default async function Page() {
	const userSession = await auth();
	const authUser = await db.query.user.findFirst({
		where: (user, { eq }) => eq(user.id, userSession?.user.id as string),
	});
	return <ClientPage authUser={authUser} />;
}
