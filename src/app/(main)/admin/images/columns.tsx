"use client";
import type { SelectImageRelation } from "@/lib/drizzle/relational-types";
import type { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

export const columns: ColumnDef<SelectImageRelation>[] = [
	{
		accessorKey: "friendlyName",
		header: "Name",
	},
	{
		accessorKey: "dockerImage",
		header: "Docker Image",
	},
	{
		accessorKey: "category",
		header: "Category",
	},
	{
		accessorKey: "icon",
		header: "Icon",
		cell: ({ row }) => (
			<Image className="h-12 w-12" alt={row.original.friendlyName} src={row.original.icon} width={48} height={48} />
		),
	},
	{
		accessorKey: "pulled",
		header: "Pulled",
	},
];
