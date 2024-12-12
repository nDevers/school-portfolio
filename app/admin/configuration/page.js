'use client'
import PageTitle from '@/components/admin/common/PageTitle'
import ConfigurationForm from '@/components/admin/form/ConfigurationForm'
import Spinner from '@/components/common/Spinner';
import apiConfig from '@/configs/apiConfig';
import { fetchData } from '@/util/axios';
import { useQuery } from '@tanstack/react-query';

export default function ConfigurationPage() {
    const { isLoading, data } = useQuery({
        queryKey: ['configuration'],
        queryFn: () => fetchData(apiConfig?.GET_CONFIGURATION),
    });

    return (
        <div className='w-full h-full'>
            <PageTitle title='Configuration' />
            {isLoading && <Spinner/>}
            {data && <ConfigurationForm data={data} />}
        </div>
    )
}
