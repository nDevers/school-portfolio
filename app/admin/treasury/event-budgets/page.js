'use client'
import AddButton from '@/components/admin/button/AddButton'
import PageTitle from '@/components/admin/common/PageTitle'
import { EventBudgetTableColumn } from '@/components/admin/table/DefaultColumns'
import DefaultTable from '@/components/admin/table/DefaultTable'
import apiConfig from '@/configs/apiConfig'
import { fetchData } from '@/util/axios'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

export default function EventBudgetPage() {
    const { isLoading, data } = useQuery({
        queryKey: ['event-budget'],
        queryFn: () => fetchData(apiConfig?.GET_BUDGET),
    });
    // const data = [
    //     {
    //         id: 1,
    //         eventName: "Tech Conference 2024",
    //         startTime: "2024-04-15T09:00:00",
    //         endTime: "2024-04-15T17:00:00",
    //         totalBudget: 5000,
    //         description: "Annual conference focusing on AI, cybersecurity, and web development. Includes speaker sessions, networking opportunities, and a tech expo. Budget covers venue, catering, and speaker fees.",
    //         location: "Downtown Conference Center",
    //         lastModified: "2024-02-20T14:30:00",
    //     },
    //     {
    //         id: 2,
    //         eventName: "Startup Pitch Night",
    //         startTime: "2024-06-20T18:00:00",
    //         endTime: "2024-06-20T21:00:00",
    //         totalBudget: 3000,
    //         description: "Evening event for startups to pitch ideas to investors. Includes networking and Q&A. Budget covers venue, catering, and prize funds.",
    //         location: "Innovation Hub Auditorium",
    //         lastModified: "2024-03-01T10:00:00",
    //     },
    //     {
    //         id: 3,
    //         eventName: "Community Workshop: Coding for Kids",
    //         startTime: "2024-07-05T10:00:00",
    //         endTime: "2024-07-05T15:00:00",
    //         totalBudget: 1500,
    //         description: "Free workshop introducing basic coding concepts to kids aged 8-12. Covers instructors, venue, and educational materials.",
    //         location: "Public Library Event Room",
    //         lastModified: "2024-05-15T09:00:00",
    //     },
    //     {
    //         id: 4,
    //         eventName: "Annual Charity Gala",
    //         startTime: "2024-09-10T19:00:00",
    //         endTime: "2024-09-10T23:00:00",
    //         totalBudget: 10000,
    //         description: "Formal charity event to raise funds for local projects. Includes dinner, live music, and auctions. Budget for venue, entertainment, and decorations.",
    //         location: "Grand Ballroom, City Center Hotel",
    //         lastModified: "2024-06-10T12:00:00",
    //     },
    //     {
    //         id: 5,
    //         eventName: "Environmental Awareness Workshop",
    //         startTime: "2024-08-12T09:00:00",
    //         endTime: "2024-08-12T16:00:00",
    //         totalBudget: 2000,
    //         description: "Workshop on environmental conservation. Features talks from experts and hands-on activities. Budget allocated for venue, speaker fees, and materials.",
    //         location: "City Park Pavilion",
    //         lastModified: "2024-07-01T11:30:00",
    //     },
    //     {
    //         id: 6,
    //         eventName: "Leadership Summit",
    //         startTime: "2024-10-05T08:00:00",
    //         endTime: "2024-10-05T17:00:00",
    //         totalBudget: 7500,
    //         description: "Summit focused on leadership skills and personal growth. Includes panel discussions, keynotes, and workshops. Covers venue, catering, and promotional materials.",
    //         location: "Metropolitan Convention Center",
    //         lastModified: "2024-06-25T08:45:00",
    //     },
    //     {
    //         id: 7,
    //         eventName: "Holiday Fundraiser",
    //         startTime: "2024-12-10T18:00:00",
    //         endTime: "2024-12-10T22:00:00",
    //         totalBudget: 4500,
    //         description: "Holiday-themed fundraiser with music, games, and prizes. All proceeds support community outreach programs. Budget allocated for decorations, entertainment, and refreshments.",
    //         location: "Community Center Hall",
    //         lastModified: "2024-11-01T15:00:00",
    //     },
    // ];
    return (
        <div className="space-y-4">

            <div className="flex justify-between items-center">
                <PageTitle title="Event Budget" />
                <AddButton title='New Budget' link='event-budgets/add'/>
            </div>

            <DefaultTable list={data || []} column={EventBudgetTableColumn} />
        </div>
    )
}
