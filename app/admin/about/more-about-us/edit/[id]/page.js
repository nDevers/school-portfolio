import NoDataFound from '@/components/admin/common/NoDataFound';
import PageTitle from '@/components/admin/common/PageTitle'
import MoreAboutUsForm from '@/components/admin/form/MoreAboutUsForm';
import apiConfig from '@/configs/apiConfig'
import { fetchDataAsServer } from '@/util/axios';

export default async function MoreAboutUsEditPage({ params }) {
    const { id } = params;
    const data = await fetchDataAsServer(apiConfig?.GET_MORE_ABOUT_US_BY_ID + id)

    return (
        <div className='space-y-4'>
            <PageTitle title='Edit More About Us' />
            {data ? (
                <MoreAboutUsForm data={data} />
            ) : (
                <NoDataFound />
            )}
        </div>
    )
}

// Return a list of `params` to populate the [id] dynamic segment
export async function generateStaticParams() {
    const data = await fetchDataAsServer(apiConfig?.GET_MORE_ABOUT_US)
    return Array.isArray(data) ? data?.map((item) => ({
        id: encodeURIComponent(item?.id || item?._id),
    })) : [];
}