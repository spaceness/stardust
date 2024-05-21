import { db } from "@/lib/drizzle/db";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import type { Metadata } from "next";
export const metadata: Metadata = {
	title: "Sessions",
};
export default async function AdminPage() {
	const sessions = await db.query.session.findMany({
		with: {
			user: true,
		},
	});
	return (
		<div className="flex h-full flex-col">
			<h1 className="ml-10 py-6 text-3xl font-bold">Sessions</h1>
			<section className="flex justify-center items-start w-full h-full">
				<DataTable columns={columns} data={sessions} />
			</section>
		</div>
	);
}
