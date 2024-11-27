'use client'
import React from "react";
import apiConfig from "@/configs/apiConfig";
import DefaultTable from "@/components/admin/table/DefaultTable";
import PageTitle from "@/components/admin/common/PageTitle";
import AddButton from "@/components/admin/button/AddButton";
import { DonationTableColumn } from "@/components/admin/table/DefaultColumns";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { fetchData } from "@/util/axios";
import { useQuery } from "@tanstack/react-query";

export default function DonationPage() {
    const { isLoading, data } = useQuery({
        queryKey: ['donation'],
        queryFn: () => fetchData(apiConfig?.GET_DONATION),
    });

    const currentAmount = "$12,500";
    const lastMonthAmount = "$10,000";
    const totalDonors = 125;

    return (
        <div className="space-y-4">

            <div className="flex justify-between items-center">
                <PageTitle title="Donations" />
                <AddButton title="Add Donation" link='donations/add'/>
            </div>

            {/* Header Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <DonationCard title="Current Amount" value={currentAmount} />
                <DonationCard title="Last Month" value={lastMonthAmount} />
                <DonationCard title="Total Donors" value={totalDonors} />
            </div>

            <DefaultTable list={data || []} column={DonationTableColumn} />
        </div>
    );
}

export function DonationCard({ title, value, className }) {
    return (
        <Card className={`bg-muted/10 ${className}`}>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription className="text-2xl font-semibold">{value}</CardDescription>
            </CardHeader>
        </Card>
    );
}