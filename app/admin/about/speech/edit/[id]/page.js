import NoDataFound from '@/components/admin/common/NoDataFound';
import PageTitle from '@/components/admin/common/PageTitle';
import SchoolSpeechForm from '@/components/admin/form/SchoolSpeechForm';
import apiConfig from '@/configs/apiConfig';
import { fetchDataAsServer } from '@/util/axios';

export default async function SchoolSpeechEditPage({ params }) {
    const { id } = params;
    const data = await fetchDataAsServer(
        apiConfig?.GET_SCHOOL_SPEECH_BY_ID + id
    );

    return (
        <div className="space-y-4">
            <PageTitle title="Edit School Speech" />
            {data ? <SchoolSpeechForm data={data} /> : <NoDataFound />}
        </div>
    );
}

// Return a list of `params` to populate the [id] dynamic segment
export async function generateStaticParams() {
    const data = await fetchDataAsServer(apiConfig?.GET_SCHOOL_SPEECH);
    return Array.isArray(data)
        ? data?.map((item) => ({
              id: encodeURIComponent(item?.id || item?._id),
          }))
        : [];
}
