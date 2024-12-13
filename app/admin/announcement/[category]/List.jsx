'use client'
import apiConfig from "@/configs/apiConfig";
import AddButton from "@/components/admin/button/AddButton";
import PageTitle from "@/components/admin/common/PageTitle";
import DefaultTable from "@/components/admin/table/DefaultTable";
import { fetchData } from "@/util/axios";
import { useQuery } from "@tanstack/react-query";
import { AcademicTableColumn } from "@/components/admin/table/DefaultColumns";

export default function List({ category }) {

  const { isLoading, data } = useQuery({
    queryKey: ['GET_ANNOUNCEMENT_BY_CATEGORY', category],
    queryFn: () => fetchData(apiConfig?.GET_ANNOUNCEMENT_BY_CATEGORY + category),
    enabled: !!category
  });

  function capitalize(word) {
    if (!word) return "";
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }

  return (
    <div className='space-y-4'>
      <div className="flex justify-between items-center">
        <PageTitle title={capitalize(category)} />
        <AddButton link={`${category}/add`} />
      </div>
      <DefaultTable isLoading={isLoading} list={data || []} column={AcademicTableColumn} />
    </div>
  )
}
