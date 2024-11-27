'use client'
import PageTitle from '@/components/admin/common/PageTitle'
import DefaultTable from '@/components/admin/table/DefaultTable'
import apiConfig from '@/configs/apiConfig'
import AddButton from '@/components/admin/button/AddButton'
import { EligibleSchoolTableColumn } from '@/components/admin/table/DefaultColumns'
import { fetchData } from '@/util/axios'
import { useQuery } from '@tanstack/react-query'

export default function EligibleSchoolPage() {

    const { isLoading, data } = useQuery({
        queryKey: ['eligibleSchool'],
        queryFn: () => fetchData(apiConfig?.GET_ELIGIBLE_SCHOOL),
    });
  return (
    <div className='space-y-4'>
        <div className="flex justify-between items-center">
            <PageTitle title="Eligible Schools" />
            <AddButton link='school/add'/>
        </div>
        
        <DefaultTable list={data || []} column={EligibleSchoolTableColumn}/>
      </div>
  )
}
