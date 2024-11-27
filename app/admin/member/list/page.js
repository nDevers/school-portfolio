'use client'
import PageTitle from '@/components/admin/common/PageTitle';
import AddButton from '@/components/admin/button/AddButton';
import apiConfig from '@/configs/apiConfig';
import DefaultTable from '@/components/admin/table/DefaultTable';
import { MemberTableColumn } from '@/components/admin/table/DefaultColumns';
import { fetchData } from '@/util/axios';
import { useQuery } from '@tanstack/react-query';

export default function MemberListPage() {
    const { isLoading, data } = useQuery({
        queryKey: ['member'],
        queryFn: () => fetchData(apiConfig?.GET_MEMBER_LIST),
    });

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <PageTitle title="Member List" />
                <AddButton/>
            </div>
            
            <DefaultTable list={data || []} column={MemberTableColumn}/>
        </div>
    )
}
