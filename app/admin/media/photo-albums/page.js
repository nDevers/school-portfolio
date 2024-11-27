'use client'
import PageTitle from '@/components/admin/common/PageTitle'
import DefaultTable from '@/components/admin/table/DefaultTable'
import apiConfig from '@/configs/apiConfig'
import AddButton from '@/components/admin/button/AddButton'
import { PhotoAlbumTableColumn } from '@/components/admin/table/DefaultColumns'
import { fetchData } from '@/util/axios'
import { useQuery } from '@tanstack/react-query'

export default function PhotoAlbumsPage() {

    const { isLoading, data } = useQuery({
        queryKey: ['photo'],
        queryFn: () => fetchData(apiConfig?.GET_PHOTO),
    });

    return(
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <PageTitle title="Photo Albums" />
                <AddButton link='photo-albums/add'/>
            </div>
            
            <DefaultTable list={data || []} column={PhotoAlbumTableColumn}/>
        </div>
    )
}
