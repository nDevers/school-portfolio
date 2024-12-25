'use client';
import apiConfig from '@/configs/apiConfig';
import AddButton from '@/components/admin/button/AddButton';
import PageTitle from '@/components/admin/common/PageTitle';
import DefaultTable from '@/components/admin/table/DefaultTable';
import { fetchData } from '@/util/axios';
import { useQuery } from '@tanstack/react-query';
import { SchoolAchievementTableColumn } from '@/components/admin/table/DefaultColumns';

export default function SchoolAchievementPage() {
    const { isLoading, data } = useQuery({
        queryKey: ['GET_SCHOOL_ACHIEVEMENT'],
        queryFn: () => fetchData(apiConfig?.GET_SCHOOL_ACHIEVEMENT),
    });

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <PageTitle title="School Achievement" />
                <AddButton link="achievement/add" />
            </div>
            <DefaultTable
                isLoading={isLoading}
                list={data || []}
                column={SchoolAchievementTableColumn}
            />
        </div>
    );
}
