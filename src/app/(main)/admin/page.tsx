import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAuthSession } from "@/lib/auth";
import { db, image, session, user } from "@/lib/drizzle/db";
import { Container, Users } from "lucide-react";

export default async function AdminPage() {
  const userSession = await getAuthSession();
  const { users, sessions } = await db.transaction(async (tx) => {
    const users = await tx.select().from(user);
    const sessions = await tx.query.session.findMany({
      with: { user: true },
    });
    return { users, sessions };
  });
  const activeUsers = sessions.map((s) => s.user);
  return (
    <div className="flex h-full flex-col">
      <h1 className="ml-10 py-6 text-3xl font-bold">
        Welcome, {userSession.user?.name}
      </h1>
      <section className="flex justify-start items-start h-full ml-10 gap-4">
        <Card className="w-64">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessions</CardTitle>
            <Container className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sessions.length}</div>
            <p className="text-xs text-muted-foreground">
              {activeUsers.length} user{activeUsers.length === 1 ? "" : "s"}{" "}
              active
            </p>
          </CardContent>
        </Card>
        <Card className="w-64">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">
              {users.filter((u) => u.isAdmin).length > 1
                ? `There are ${users.filter((u) => u.isAdmin).length} admins`
                : `There is ${users.filter((u) => u.isAdmin).length} admin`}
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
