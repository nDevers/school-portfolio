import PageTitle from '@/components/admin/common/PageTitle';
import AcademicForm from '@/components/admin/form/AcademicForm';

export default function AcademicAddPage({ params }) {
    const { category } = params;
    return (
        <div>
            <PageTitle title="Create New Academic File" />
            <AcademicForm category={category} />
        </div>
    );
}
