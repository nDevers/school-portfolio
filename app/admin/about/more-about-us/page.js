'use client';
import apiConfig from '@/configs/apiConfig';
import AddButton from '@/components/admin/button/AddButton';
import PageTitle from '@/components/admin/common/PageTitle';
import DefaultTable from '@/components/admin/table/DefaultTable';
import { fetchData } from '@/util/axios';
import { useQuery } from '@tanstack/react-query';
import { MoreAboutUsTableColumn } from '@/components/admin/table/DefaultColumns';

export default function MoreAboutUsPage() {
    const { isLoading, data } = useQuery({
        queryKey: ['GET_MORE_ABOUT_US'],
        queryFn: () => fetchData(apiConfig?.GET_MORE_ABOUT_US),
    });

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <PageTitle title="More About The School" />
                <AddButton link="more-about-us/add" />
            </div>
            <DefaultTable
                isLoading={isLoading}
                list={data || []}
                column={MoreAboutUsTableColumn}
            />
        </div>
    );
}
