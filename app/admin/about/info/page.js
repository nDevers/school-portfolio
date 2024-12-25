'use client'
import apiConfig from "@/configs/apiConfig";
import AddButton from "@/components/admin/button/AddButton";
import PageTitle from "@/components/admin/common/PageTitle";
import DefaultTable from "@/components/admin/table/DefaultTable";
import { fetchData } from "@/util/axios";
import { useQuery } from "@tanstack/react-query";
import { SchoolInfoTableColumn } from "@/components/admin/table/DefaultColumns";

export default function SchoolInfoPage() {

    const { isLoading, data } = useQuery({
        queryKey: ['GET_SCHOOL_INFO'],
        queryFn: () => fetchData(apiConfig?.GET_SCHOOL_INFO),
    });

    return (
        <div className='space-y-4'>
            <div className="flex justify-between items-center">
                <PageTitle title="School Basic Information" />
                <AddButton link='info/add' />
            </div>
            <DefaultTable isLoading={isLoading} list={data || []} column={SchoolInfoTableColumn} />
        </div>
    )
}
