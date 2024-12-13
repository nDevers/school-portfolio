import NoDataFound from '@/components/admin/common/NoDataFound';
import PageTitle from '@/components/admin/common/PageTitle'
import SchoolInfoForm from '@/components/admin/form/SchoolInfoForm';
import apiConfig from '@/configs/apiConfig'
import { fetchDataAsServer } from '@/util/axios';

export default async function SchoolInfoPage({ params }) {
    const { id } = params;
    const data = await fetchDataAsServer(apiConfig?.GET_SCHOOL_INFO_BY_ID + id)

    return (
        <div className='space-y-4'>
            <PageTitle title='Edit Shool Information' />
            {data ? (
                <SchoolInfoForm data={data} />
            ) : (
                <NoDataFound />
            )}
        </div>
    )
}

// Return a list of `params` to populate the [id] dynamic segment
export async function generateStaticParams() {
    const data = await fetchDataAsServer(apiConfig?.GET_SCHOOL_INFO)
    return Array.isArray(data) ? data?.map((item) => ({
        id: encodeURIComponent(item?.id || item?._id),
    })) : [];
}