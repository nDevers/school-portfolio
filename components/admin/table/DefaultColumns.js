'use client';

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import DeleteDropdownMenuItem from "@/components/admin/common/DeleteDropdownMenuItem";
import apiConfig from "@/configs/apiConfig";
import Image from "next/image";

export const FacultyTableColumn = [
    {
        accessorKey: "sn",
        header: "SN",
        cell: ({ row }) => <span className="w-fit">{Number(row?.id) + 1}</span>
    },
    {
        accessorKey: "image",
        header: "Image",
        cell: ({ row, getValue }) => <Image src={getValue()} alt={row?.original?.name} height={50} width={50} className="w-8 aspect-square rounded-full ring-1" />
    },
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "category",
        header: "Category",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "mobile",
        header: "Mobile",
    },
    {
        accessorKey: "portfolio",
        header: "Portfolio",
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

                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(data?.id || data?._id)}> Copy ID </DropdownMenuItem>

                            <DropdownMenuItem>
                                <Link href={`${data?.category}/edit/${data?.id || data?._id}` || '#'} className="w-full">Edit</Link>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DeleteDropdownMenuItem api={apiConfig?.DELETE_FACULTY_BY_CATEGORY} id={`${data?.category}/${data?.id || data?._id}`} query={'GET_FACULTY_BY_CATEGORY'} />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
    },
];

export const AcademicTableColumn = [
    {
        accessorKey: "sn",
        header: "SN",
        cell: ({ row }) => <span className="w-fit">{Number(row?.id) + 1}</span>
    },
    {
        accessorKey: "title",
        header: "Title",
    },
    // {
    //     accessorKey: "description",
    //     header: "Description",
    // },
    {
        accessorKey: "badge",
        header: "Badge",
    },
    {
        accessorKey: "category",
        header: "Category",
    },
    {
        accessorKey: "publishDate",
        header: "Publish Date",
        cell: ({ getValue }) => <span>{getValue().split("T")[0]}</span>
    },
    {
        accessorKey: "file",
        header: "File",
        cell: ({ getValue }) => {
            const fileUrl = getValue();
            return fileUrl ? (
                <Link href={fileUrl} download target="_blank" className="text-blue-500">
                    Download
                </Link>
            ) : (
                <span>No File</span>
            );
        },
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

                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(data?.id || data?._id)}> Copy ID </DropdownMenuItem>

                            <DropdownMenuItem>
                                <Link href={`${data?.category}/edit/${data?.id || data?._id}` || '#'} className="w-full">Edit</Link>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DeleteDropdownMenuItem api={apiConfig?.DELETE_ACADEMIC_BY_CATEGORY} id={`${data?.category}/${data?.id || data?._id}`} query={'GET_ACADEMIC_BY_CATEGORY'} />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
    },
];

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

                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(data?.id || data?._id)}> Copy ID </DropdownMenuItem>

                            <DropdownMenuItem>
                                <Link href={`faq/edit/${data?.id || data?._id}` || '#'} className="w-full">Edit</Link>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DeleteDropdownMenuItem api={apiConfig?.DELETE_FAQ} id={`${data?.id || data?._id}`} query={'GET_FAQ'} />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
    },
];

export const MoreAboutUsTableColumn = [
    {
        accessorKey: "sn",
        header: "SN",
        cell: ({ row }) => <span className="w-fit">{Number(row?.id) + 1}</span>
    },
    {
        accessorKey: "title",
        header: "title",
    },
    {
        accessorKey: "files",
        header: "Files",
        cell: ({ getValue }) => <span>{getValue()?.length}</span>
    },
    {
        accessorKey: "images",
        header: "Images",
        cell: ({ getValue }) => <span>{getValue()?.length}</span>
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

                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(data?.id || data?._id)}> Copy ID </DropdownMenuItem>

                            <DropdownMenuItem>
                                <Link href={`more-about-us/edit/${data?.id || data?._id}` || '#'} className="w-full">Edit</Link>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DeleteDropdownMenuItem api={apiConfig?.DELETE_MORE_ABOUT_US} id={`${data?.id || data?._id}`} query={'GET_MORE_ABOUT_US'} />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
    },
];

export const CareerTableColumn = [
    {
        accessorKey: "sn",
        header: "SN",
        cell: ({ row }) => <span className="w-fit">{Number(row?.id) + 1}</span>
    },
    {
        accessorKey: "title",
        header: "Title",
    },
    {
        accessorKey: "subTitle",
        header: "Sub Title",
    },
    {
        accessorKey: "date",
        header: "Date",
    },
    {
        accessorKey: "files",
        header: "Files",
        cell: ({ getValue }) => <span>{getValue()?.length}</span>
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

                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(data?.id || data?._id)}> Copy ID </DropdownMenuItem>

                            <DropdownMenuItem>
                                <Link href={`career/edit/${data?.id || data?._id}` || '#'} className="w-full">Edit</Link>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DeleteDropdownMenuItem api={apiConfig?.DELETE_CAREER} id={`${data?.id || data?._id}`} query={'GET_CAREER'} />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
    },
];

export const SchoolInfoTableColumn = [
    {
        accessorKey: "sn",
        header: "SN",
        cell: ({ row }) => <span className="w-fit">{Number(row?.id) + 1}</span>
    },
    {
        accessorKey: "icon",
        header: "Icon",
        cell: ({ row, getValue }) => <Image src={getValue()} alt={row?.original?.title} height={50} width={50} className="w-8 aspect-square rounded-full ring-1" />
    },
    {
        accessorKey: "title",
        header: "Title",
    },
    {
        accessorKey: "description",
        header: "Description",
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

                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(data?.id || data?._id)}> Copy ID </DropdownMenuItem>

                            <DropdownMenuItem>
                                <Link href={`info/edit/${data?.id || data?._id}` || '#'} className="w-full">Edit</Link>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DeleteDropdownMenuItem api={apiConfig?.DELETE_SCHOOL_INFO} id={`${data?.id || data?._id}`} query={'GET_SCHOOL_INFO'} />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
    },
];

export const SchoolAchievementTableColumn = [
    {
        accessorKey: "sn",
        header: "SN",
        cell: ({ row }) => <span className="w-fit">{Number(row?.id) + 1}</span>
    },
    {
        accessorKey: "icon",
        header: "Icon",
        cell: ({ row, getValue }) => <Image src={getValue()} alt={row?.original?.title} height={50} width={50} className="w-8 aspect-square rounded-full ring-1" />
    },
    {
        accessorKey: "description",
        header: "Achievement Description",
    },
    {
        accessorKey: "title",
        header: "Achievement Count",
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

                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(data?.id || data?._id)}> Copy ID </DropdownMenuItem>

                            <DropdownMenuItem>
                                <Link href={`achievement/edit/${data?.id || data?._id}` || '#'} className="w-full">Edit</Link>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DeleteDropdownMenuItem api={apiConfig?.DELETE_SCHOOL_ACHIEVEMENT} id={`${data?.id || data?._id}`} query={'GET_SCHOOL_ACHIEVEMENT'} />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
    },
];

export const SchoolSpeechTableColumn = [
    {
        accessorKey: "sn",
        header: "SN",
        cell: ({ row }) => <span className="w-fit">{Number(row?.id) + 1}</span>
    },
    {
        accessorKey: "image",
        header: "Image",
        cell: ({ row, getValue }) => <Image src={getValue()} alt={row?.original?.title} height={50} width={50} className="w-8 aspect-square rounded-full ring-1" />
    },
    {
        accessorKey: "title",
        header: "Spiker Name",
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

                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(data?.id || data?._id)}> Copy ID </DropdownMenuItem>

                            <DropdownMenuItem>
                                <Link href={`speech/edit/${data?.id || data?._id}` || '#'} className="w-full">Edit</Link>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DeleteDropdownMenuItem api={apiConfig?.DELETE_SCHOOL_SPEECH} id={`${data?.id || data?._id}`} query={'GET_SCHOOL_SPEECH'} />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
    },
];