import NoDataFound from '@/components/admin/common/NoDataFound';
import PageTitle from '@/components/admin/common/PageTitle';
import FacultyForm from '@/components/admin/form/FacultyForm';
import apiConfig from '@/configs/apiConfig';
import { fetchDataAsServer } from '@/util/axios';

export default async function FacultyEditPage({ params }) {
    const { category, id } = params;
    const data = await fetchDataAsServer(
        `${apiConfig?.GET_FACULTY_BY_CATEGORY_BY_ID}${category}/${id}`
    );

    return (
        <div className="space-y-4">
            <PageTitle title="Edit Faculty Member" />
            {data ? (
                <FacultyForm data={data} category={category} />
            ) : (
                <NoDataFound />
            )}
        </div>
    );
}

// Return a list of `params` to populate the [id] dynamic segment
export async function generateStaticParams() {
    const data = await fetchDataAsServer(apiConfig?.GET_FACULTY_All);
    return Array.isArray(data)
        ? data?.map((item) => ({
              id: encodeURIComponent(item?.id || item?._id),
              category: encodeURIComponent(item?.category),
          }))
        : [];
}
