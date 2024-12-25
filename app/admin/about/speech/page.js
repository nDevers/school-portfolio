'use client';
import apiConfig from '@/configs/apiConfig';
import AddButton from '@/components/admin/button/AddButton';
import PageTitle from '@/components/admin/common/PageTitle';
import DefaultTable from '@/components/admin/table/DefaultTable';
import { fetchData } from '@/util/axios';
import { useQuery } from '@tanstack/react-query';
import { SchoolSpeechTableColumn } from '@/components/admin/table/DefaultColumns';

export default function SpeechPage() {
    const { isLoading, data } = useQuery({
        queryKey: ['GET_SCHOOL_SPEECH'],
        queryFn: () => fetchData(apiConfig?.GET_SCHOOL_SPEECH),
    });

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <PageTitle title="Speech from School" />
                <AddButton link="speech/add" />
            </div>
            <DefaultTable
                isLoading={isLoading}
                list={data || []}
                column={SchoolSpeechTableColumn}
            />
        </div>
    );
}
