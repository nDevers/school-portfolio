'use client'
import apiConfig from "@/configs/apiConfig";
import AddButton from "@/components/admin/button/AddButton";
import PageTitle from "@/components/admin/common/PageTitle";
import DefaultTable from "@/components/admin/table/DefaultTable";
import { fetchData } from "@/util/axios";
import { useQuery } from "@tanstack/react-query";
import { CareerTableColumn } from "@/components/admin/table/DefaultColumns";

export default function CareerPage() {

    const { isLoading, data } = useQuery({
        queryKey: ['GET_CAREER'],
        queryFn: () => fetchData(apiConfig?.GET_CAREER),
    });

    return (
        <div className='space-y-4'>
            <div className="flex justify-between items-center">
                <PageTitle title="Manage Resources: Career" />
                <AddButton link='career/add' />
            </div>
            <DefaultTable isLoading={isLoading} list={data || []} column={CareerTableColumn} />
        </div>
    )
}
