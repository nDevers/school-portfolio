'use client'
import PageTitle from '@/components/admin/common/PageTitle'
import DefaultTable from '@/components/admin/table/DefaultTable'
import apiConfig from '@/configs/apiConfig'
import AddButton from '@/components/admin/button/AddButton'
import { ScholarshipFormTableColumn } from '@/components/admin/table/DefaultColumns'
import { fetchData } from '@/util/axios'
import { useQuery } from '@tanstack/react-query'

export default function ScholarshipForm() {

    const { isLoading, data } = useQuery({
        queryKey: ['scholarship'],
        queryFn: () => fetchData(apiConfig?.GET_SCHOLARSHIP_FORM),
    });
  
    return (
      <div className='space-y-4'>
        <div className="flex justify-between items-center">
            <PageTitle title="Scholarship Event Forms" />
            <AddButton link='scholarship/add'/>
        </div>
        
        <DefaultTable list={data || []} column={ScholarshipFormTableColumn}/>
      </div>
    )
  }
  