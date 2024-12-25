import { AcademicCategories } from '@/components/admin/common/AppSidebar';
import List from './List';

export default function AcademicPage({ params }) {
    const { category } = params;
    return <List category={category} />;
}

// Return a list of `params` to populate the [id] dynamic segment
export async function generateStaticParams() {
    const allowedCategories = AcademicCategories;
    return Array.isArray(allowedCategories)
        ? allowedCategories?.map((item) => ({
              category: encodeURIComponent(item?.category),
          }))
        : [];
}
