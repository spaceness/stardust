import Navigation from "@/components/navbar";
import { auth } from "@/lib/auth";
import { db, user as userSchema } from "@/lib/drizzle/db";
import { eq } from "drizzle-orm";
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const userSession = await auth();
  const [dbUser] = await db
    .select()
    .from(userSchema)
    .where(eq(userSchema.email, userSession?.user?.email as string));
  return (
    <main className="h-[90vh]">
      <Navigation dbUser={dbUser} session={userSession} />
      {children}
    </main>
  );
}
