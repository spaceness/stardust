"use client";
import { deleteImage } from "@/actions/image";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { SelectImageRelation } from "@/lib/drizzle/relational-types";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { ManageForm } from "./image-dialog";

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
		id: "actions",
		header: ({ table }) => {
			return table.getFilteredSelectedRowModel().rows.length > 0 ? (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem>Delete images</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			) : null;
		},
		cell: ({ row }) => {
			const [dialogOpen, setDialogOpen] = useState(false);
			return (
				<>
					<ManageForm trigger={false} showState={dialogOpen} setShowState={setDialogOpen} updateValue={row.original} />
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="h-8 w-8 p-0">
								<span className="sr-only">Open menu</span>
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Actions</DropdownMenuLabel>
							<DropdownMenuItem onClick={() => setDialogOpen((prev) => !prev)}>Edit</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() =>
									toast.promise(() => deleteImage(row.original.dockerImage), {
										loading: "Deleting image...",
										success: "Image deleted",
										error: "Failed to delete image",
									})
								}
							>
								Delete
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</>
			);
		},
	},
];
