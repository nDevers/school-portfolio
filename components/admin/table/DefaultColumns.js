'use client';

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import DeleteDropdownMenuItem from "@/components/admin/common/DeleteDropdownMenuItem";
import apiConfig from "@/configs/apiConfig";
import { usePathname } from "next/navigation";
import getYoutubeVideo from "@/util/getYoutubeVideo";

export const DonationTableColumn = [
    {
        accessorKey: "id",
        header: "SN",
        cell: ({ getValue }) => <span>{getValue()}</span>
    },
    {
        accessorKey: "memberDetails",
        header: "Donor Name",
        cell: ({ row }) => row.original.memberDetails?.name || "N/A",
    },
    {
        accessorKey: "memberDetails",
        header: "Donor Email",
        cell: ({ row }) => row.original.memberDetails?.email || "N/A",
    },
    {
        accessorKey: "type",
        header: "Type",
    },
    {
        accessorKey: "amount",
        header: "Amount",
    },
    {
        accessorKey: "date",
        header: "Date",
    },
    {
        accessorKey: "description",
        header: "Description",
    },
    {
        accessorKey: "bankDetails",
        header: "Bank Name",
        cell: ({ row }) => row.original.bankDetails?.bankName || "N/A",
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const data = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <DotsHorizontalIcon className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger><DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>

                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(data?._id)}> Copy ID </DropdownMenuItem>

                        <DropdownMenuItem>
                            <Link href={`donations/edit/${data?._id}` || '#'} className="w-full">Edit</Link>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DeleteDropdownMenuItem api={apiConfig?.DELETE_DONATION} id={data?._id} query={'donation'} />
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
];

export const TeamTableColumn = [
    {
        accessorKey: "image",
        header: "Image",
        cell: ({ row, getValue }) => <img src={getValue()} alt={`Team image ${row?.original?.id}`} width={20} height={20} className="rounded-full" />
    },
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "typeId",
        header: "Type",
    },
    {
        accessorKey: "statusId",
        header: "Status",
    },
    {
        accessorKey: "joinDate",
        header: "Join date",
    },
    {
        accessorKey: "designation",
        header: "Designation",
    },
    {
        accessorKey: "organization",
        header: "Organization",
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const data = row.original

            return (
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
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Link href={`team/edit/${data?._id}`} className="w-full">Edit</Link>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DeleteDropdownMenuItem api={apiConfig?.DELETE_TEAM_COMMITTEE} id={data?._id} query={'team'} />
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
];

export const EventBudgetTableColumn = [
    {
        accessorKey: "id",
        header: "SN",
        cell: ({ getValue }) => <span>{getValue()}</span>,
    },
    {
        accessorKey: "eventName",
        header: "Event Name",
    },
    {
        accessorKey: "startTime",
        header: "Start Time",
        cell: ({ getValue }) => <span>{new Date(getValue())?.toLocaleString()}</span>,
    },
    {
        accessorKey: "endTime",
        header: "End Time",
        cell: ({ getValue }) => <span>{new Date(getValue())?.toLocaleString()}</span>,
    },
    {
        accessorKey: "totalBudget",
        header: "Budget",
        cell: ({ getValue }) => <span>${getValue()?.toLocaleString()}</span>,
    },
    {
        accessorKey: "description",
        header: "Description",
        cell: ({ getValue }) => <span>{getValue()?.slice(0, 50)}...</span>, // Show only first 50 characters
    },
    {
        accessorKey: "location",
        header: "Location",
    },
    {
        accessorKey: "lastModified",
        header: "Last Modified",
        cell: ({ getValue }) => <span>{new Date(getValue())?.toLocaleString()}</span>,
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const data = row.original

            return (
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
                            <Link href={`event-budgets/edit/${data?._id}` || '#'} className="w-full">Edit</Link>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DeleteDropdownMenuItem api={apiConfig?.DELETE_BUDGET} id={data?._id} query={'event-budget'} />
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
];

export const MemberTableColumn = [
    {
        accessorKey: "memberId",
        header: "Member ID",
        cell: ({ getValue }) => <span>{getValue()}</span>
    },
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "phone",
        header: "Phone",
    },
    {
        accessorKey: "nid",
        header: "NID",
    },
    {
        accessorKey: "educationalBackground",
        header: "Education",
    },
    {
        accessorKey: "occupation",
        header: "Occupation",
    },
    {
        accessorKey: "workplace",
        header: "Workplace",
    },
    {
        accessorKey: "designation",
        header: "Designation",
    },
    {
        accessorKey: "bloodGroup",
        header: "Blood Group",
    },
    {
        accessorKey: "dob",
        header: "Date of Birth",
        cell: ({ getValue }) => <span>{new Date(getValue()).toLocaleDateString()}</span>
    },
    {
        accessorKey: "permanentAddress.district",
        header: "Permanent District",
    },
    {
        accessorKey: "currentAddress.district",
        header: "Current District",
        cell: ({ row }) => {
            const permanentDistrict = row.original.permanentAddress?.district;
            const currentDistrict = row.original.currentAddress?.district;
            return (
                <span>
                    {currentDistrict && currentDistrict !== permanentDistrict
                        ? currentDistrict
                        : permanentDistrict}
                </span>
            );
        }
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const data = row.original

            return (
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
                            <Link href={`edit/${data?._id}` || '#'} className="w-full">Edit</Link>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DeleteDropdownMenuItem api={apiConfig?.DELETE_MEMBER} id={data?._id} query={'member'} />
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
];

export const EventCategoryTableColumn = [
    {
        accessorKey: "sn",
        header: "SN",
        cell: ({ row }) => <span>{Number(row?.id) + 1}</span>
    },
    {
        accessorKey: "category",
        header: "Category Name",
    },
    {
        accessorKey: "isSpecial",
        header: "Event Type",
        cell: ({ getValue }) => <span>{getValue() ? 'Special' : 'Common'}</span>
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
                                <Link href={`categories/edit/${data?._id}` || '#'} className="w-full">Edit</Link>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DeleteDropdownMenuItem api={apiConfig?.DELETE_EVENT_CATEGORY} id={data?._id} query={'category'} />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
    },
];

export const EventSubcategoryTableColumn = [
    {
        accessorKey: "sn",
        header: "SN",
        cell: ({ row }) => <span>{Number(row?.id) + 1}</span>
    },
    {
        accessorKey: "subCategory",
        header: "Subcategory Name",
    },
    {
        accessorKey: "category",
        header: "Category Name",
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
                                <Link href={`sub-categories/edit/${data?._id}` || '#'} className="w-full">Edit</Link>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DeleteDropdownMenuItem api={apiConfig?.DELETE_EVENT_SUBCATEGORY} id={data?._id} query={'sub-category'} />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
    },
];

export const EventTableColumn = [
    {
        accessorKey: "sn",
        header: "SN",
        cell: ({ row }) => <span>{Number(row?.id) + 1}</span>
    },
    {
        accessorKey: "title",
        header: "Title",
    },
    {
        accessorKey: "eventDate",
        header: "Event Date",
    },
    {
        accessorKey: "statusId",
        header: "Status",
    },
    {
        accessorKey: "files",
        header: "Files",
        cell: ({ getValue }) => <span>{getValue().length}</span>
    },
    {
        accessorKey: "links",
        header: "Links",
        cell: ({ getValue }) => <span>{getValue().length}</span>
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const data = row.original
            const pathname = usePathname()

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
                                <Link href={`${pathname}/edit/${data?._id}` || '#'} className="w-full">Edit</Link>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DeleteDropdownMenuItem api={apiConfig?.DELETE_EVENT} id={data?._id} query={'events'} />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
    },
];

export const NewsAlbumTableColumn = [
    {
        accessorKey: "banner",
        header: "banner",
        cell: ({ row, getValue }) => <img src={getValue()} alt={`Banner image ${row?.original?.id}`} width={20} height={20} className="w-24 h-14 object-cover rounded" />
    },
    {
        accessorKey: "title",
        header: "Title",
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
        accessorKey: "links",
        header: "Links",
        cell: ({ getValue }) => <span>{getValue()?.length}</span>
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const data = row.original

            return (
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
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Link href={`current-news/edit/${data?._id}`} className="w-full">Edit</Link>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DeleteDropdownMenuItem api={apiConfig?.DELETE_NEWS} id={data?._id} query={'current-news'} />
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
];

export const NoticeAlbumTableColumn = [
    {
        accessorKey: "sn",
        header: "SN",
        cell: ({ row }) => <span>{Number(row?.id) + 1}</span>
    },
    {
        accessorKey: "title",
        header: "Title",
    },
    {
        accessorKey: "publishDate",
        header: "Publish Date",
    },
    {
        accessorKey: "file",
        header: "File Name",
        cell: ({ getValue }) => <span>{getValue()?.name}</span>
    },
    {
        accessorKey: "link",
        header: "Link Name",
        cell: ({ getValue }) => <span>{getValue()?.name}</span>
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const data = row.original

            return (
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
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Link href={`notice/edit/${data?._id}`} className="w-full">Edit</Link>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DeleteDropdownMenuItem api={apiConfig?.DELETE_NOTICE} id={data?._id} query={'notice'} />
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
];

export const PhotoAlbumTableColumn = [
    {
        accessorKey: "image",
        header: "Image",
        cell: ({ row, getValue }) => <img src={getValue()} alt={`Team image ${row?.original?.id}`} width={20} height={20} className="w-24 h-14 object-cover rounded-full" />
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
        accessorKey: "date",
        header: "Date",
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const data = row.original

            return (
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
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Link href={`photo-albums/edit/${data?._id}`} className="w-full">Edit</Link>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DeleteDropdownMenuItem api={apiConfig?.DELETE_PHOTO} id={data?._id} query={'photo'} />
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
];

export const VideoAlbumTableColumn = [
    {
        accessorKey: "link",
        header: "Video",
        cell: ({ row, getValue }) => {

            // Extracted YouTube video ID from the provided URL
            const videoId = getYoutubeVideo.id(getValue());
            const videoThumbnail = getYoutubeVideo.thumbnail(videoId)
            
            return (
                <div>
                    {videoId ? (
                        <Link href={getValue()} target="_blank">
                            <img
                                src={videoThumbnail}
                                alt={`YouTube Thumbnail ${row?.original?.id}`}
                                className="w-24 h-14 object-cover cursor-pointer rounded-md shadow-md hover:opacity-80"
                            />
                        </Link>
                    ) : (
                        <p>Invalid YouTube link</p>
                    )}
                </div>
            )
        }
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
        accessorKey: "date",
        header: "Date",
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const data = row.original

            return (
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
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Link href={`video-albums/edit/${data?._id}`} className="w-full">Edit</Link>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DeleteDropdownMenuItem api={apiConfig?.DELETE_VIDEO} id={data?._id} query={'video'} />
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
];

export const BenefitsOfMembersTableColumn = [
    {
        accessorKey: "sn",
        header: "SN",
        cell: ({ row }) => <span>{Number(row?.id) + 1}</span>
    },
    {
        accessorKey: "text",
        header: "Benefit",
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
                                <Link href={`benefits-of-members/edit/${data?._id}` || '#'} className="w-full">Edit</Link>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DeleteDropdownMenuItem api={apiConfig?.DELETE_BENEFITS_OF_MEMBERS} id={data?._id} query={'benefitsOfMembers'} />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
    },
];

export const MessageTableColumn = [
    {
        accessorKey: "sn",
        header: "SN",
        cell: ({ row }) => <span>{Number(row?.id) + 1}</span>
    },
    {
        accessorKey: "image",
        header: "Image",
        cell: ({ row, getValue }) => <img src={getValue()} alt={`Message image ${row?.original?._id}`} width={20} height={20} className="rounded-full" />
    },
    {
        accessorKey: "title",
        header: "Title",
    },
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "message",
        header: "Message",
        cell: ({ getValue }) => <span>{getValue().slice(0, 50)}...</span>
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
                                <Link href={`message/edit/${data?._id}` || '#'} className="w-full">Edit</Link>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DeleteDropdownMenuItem api={apiConfig?.DELETE_MESSAGE} id={data?._id} query={'message'} />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
    },
];

export const ScholarshipFormTableColumn = [
    {
        accessorKey: "sn",
        header: "SN",
        cell: ({ row }) => <span>{Number(row?.id) + 1}</span>
    },
    {
        accessorKey: "formTitle",
        header: "Title",
    },
    {
        accessorKey: "venue",
        header: "Venue",
    },
    {
        accessorKey: "eligibleSchools",
        header: "Eligible Schools",
        cell: ({ getValue }) => <span>{getValue().length}</span>
    },
    {
        accessorKey: "exam",
        header: "Exam subject",
        cell: ({ getValue }) => <span>{getValue().length}</span>
    },
    {
        accessorKey: "application",
        header: "Applications",
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
                                <Link href={`scholarship/edit/${data?._id}` || '#'} className="w-full">Edit</Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem>
                                <Link href={`scholarship/data/${data?._id}` || '#'} className="w-full">Show Applications</Link>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DeleteDropdownMenuItem api={apiConfig?.DELETE_SCHOLARSHIP_FORM} id={data?._id} query={'scholarship'} />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
    },
];

export const EligibleSchoolTableColumn = [
    {
        accessorKey: "sn",
        header: "SN",
        cell: ({ row }) => <span>{Number(row?.id) + 1}</span>
    },
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "address",
        header: "Address",
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
                                <Link href={`school/edit/${data?._id}` || '#'} className="w-full">Edit</Link>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DeleteDropdownMenuItem api={apiConfig?.DELETE_ELIGIBLE_SCHOOL} id={data?._id} query={'eligibleSchool'} />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
    },
];

export const EventStatusTableColumn = [
    {
        accessorKey: "sn",
        header: "SN",
        cell: ({ row }) => <span className="w-fit">{Number(row?.id) + 1}</span>
    },
    {
        accessorKey: "status",
        header: "Status",
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
                                <Link href={`status/edit/${data?._id}` || '#'} className="w-full">Edit</Link>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DeleteDropdownMenuItem api={apiConfig?.DELETE_EVENT_STATUS} id={data?._id} query={'eventStatus'} />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
    },
];

export const PaymentMethodTableColumn = [
    {
        accessorKey: "sn",
        header: "SN",
        cell: ({ row }) => <span>{Number(row?.id) + 1}</span>
    },
    {
        accessorKey: "type",
        header: "Method",
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
                                <Link href={`payment-method/edit/${data?._id}` || '#'} className="w-full">Edit</Link>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DeleteDropdownMenuItem api={apiConfig?.DELETE_PAYMENT_METHOD} id={data?._id} query={'payment-method'} />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
    },
];