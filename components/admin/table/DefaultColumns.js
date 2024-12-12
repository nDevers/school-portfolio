'use client';

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import DeleteDropdownMenuItem from "@/components/admin/common/DeleteDropdownMenuItem";
import apiConfig from "@/configs/apiConfig";

export const FawTableColumn = [
    {
        accessorKey: "sn",
        header: "SN",
        cell: ({ row }) => <span className="w-fit">{Number(row?.id) + 1}</span>
    },
    {
        accessorKey: "question",
        header: "Question",
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const data = row.original

            return (
                <div className="flex items-center justify-end">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <DotsHorizontalIcon className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>

                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(data?._id)}> Copy ID </DropdownMenuItem>

                            <DropdownMenuItem>
                                <Link href={`faq/edit/${data?._id}` || '#'} className="w-full">Edit</Link>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DeleteDropdownMenuItem api={apiConfig?.DELETE_FAQ} id={`${data?._id}`} query={'GET_FAQ'} />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
    },
];