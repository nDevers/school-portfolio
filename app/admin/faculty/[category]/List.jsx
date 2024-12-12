'use client'
import apiConfig from "@/configs/apiConfig";
import AddButton from "@/components/admin/button/AddButton";
import PageTitle from "@/components/admin/common/PageTitle";
import DefaultTable from "@/components/admin/table/DefaultTable";
import { fetchData } from "@/util/axios";
import { useQuery } from "@tanstack/react-query";
import { FawTableColumn } from "@/components/admin/table/DefaultColumns";

export default function List({category}) {

    const { isLoading, data } = useQuery({
        queryKey: ['GET_FACULTY_BY_CATEGORY', category],
        queryFn: () => fetchData(apiConfig?.GET_FACULTY_BY_CATEGORY + category),
        enabled: !!category
    });

  return (
    <div className='space-y-4'>
            <div className="flex justify-between items-center">
                <PageTitle title={category} />
                <AddButton link={`${category}/add`} />
            </div>
            <DefaultTable isLoading={isLoading} list={data || []} column={FawTableColumn} />
        </div>
  )
}
