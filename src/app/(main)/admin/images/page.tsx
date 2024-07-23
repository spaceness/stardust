import { DataTable } from "@/components/ui/data-table";
import { db } from "@/lib/drizzle/db";
import type { Metadata } from "next";
import { columns } from "./columns";
import { ManageForm } from "./image-dialog";
export const metadata: Metadata = {
	title: "Images",
};
export default async function AdminPage() {
	const data = await db.query.image.findMany({
		with: {
			session: true,
		},
	});
	return (
		<div className="flex h-full flex-col">
			<h1 className="py-6 text-3xl font-bold">Images</h1>
			<section className="-ml-8">
				<DataTable data={data} columns={columns} />
			</section>
			<div className="flex justify-start items-center">
				<ManageForm />
			</div>
		</div>
	);
}
