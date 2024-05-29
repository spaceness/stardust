import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { db, image, user } from "@/lib/drizzle/db";
import { Container, Layers, Users } from "lucide-react";
function mode<T>(arr: Array<T>) {
	return arr.sort((a, b) => arr.filter((v) => v === a).length - arr.filter((v) => v === b).length).pop();
}
export default async function AdminPage() {
	const userSession = await auth();
	const { users, sessions, images } = await db.transaction(async (tx) => {
		const users = await tx.select().from(user);
		const sessions = await tx.query.session.findMany({
			with: { user: true, image: true },
		});
		const images = await tx.select().from(image);
		return { users, sessions, images };
	});
	const activeUsers = [...new Set(sessions.map((s) => s.user.id))];
	return (
		<div className="flex h-full flex-col">
			<h1 className="py-6 text-3xl font-bold">Welcome, {userSession?.user?.name}</h1>
			<section className="flex justify-start items-start h-full gap-4">
				<Card className="w-64">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Sessions</CardTitle>
						<Container className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{sessions.length}</div>
						<p className="text-xs text-muted-foreground">
							{activeUsers.length} user{activeUsers.length === 1 ? "" : "s"} active
						</p>
					</CardContent>
				</Card>
				<Card className="w-64">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Images</CardTitle>
						<Layers className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{images.length}</div>
						<p className="text-xs text-muted-foreground">
							Most used image is {mode(sessions.map((s) => s.image.friendlyName)) || "N/A"}
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
								? `${users.filter((u) => u.isAdmin).length} admins`
								: `${users.filter((u) => u.isAdmin).length} admin`}
						</p>
					</CardContent>
				</Card>
			</section>
		</div>
	);
}
