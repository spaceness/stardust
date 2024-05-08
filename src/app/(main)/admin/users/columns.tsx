import type { SelectUserRelation } from "@/lib/drizzle/relational-types";
import type { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<SelectUserRelation>[] = [
	{
		accessorKey: "email",
		header: "Email",
	},
	{
		accessorKey: "name",
		header: "name",
	},
	{
		accessorKey: "id",
		header: "User ID",
	},
	{
		accessorKey: "isAdmin",
		header: "Admin",
	},
];
