'use client'
import PageTitle from '@/components/admin/common/PageTitle'
import DefaultTable from '@/components/admin/table/DefaultTable'
import apiConfig from '@/configs/apiConfig'
import AddButton from '@/components/admin/button/AddButton'
import { EventStatusTableColumn } from '@/components/admin/table/DefaultColumns'
import { fetchData } from '@/util/axios'
import { useQuery } from '@tanstack/react-query'

export default function StatusPage() {

  const { isLoading, data } = useQuery({
      queryKey: ['eventStatus'],
      queryFn: () => fetchData(apiConfig?.GET_EVENT_STATUS),
  });

  return (
    <div className='space-y-4'>
      <div className="flex justify-between items-center">
          <PageTitle title="Event Categories" />
          <AddButton link='status/add'/>
      </div>
      
      <DefaultTable list={data || []} column={EventStatusTableColumn}/>
    </div>
  )
}
