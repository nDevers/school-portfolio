import PageTitle from "@/components/admin/common/PageTitle";
import FacultyForm from "@/components/admin/form/FacultyForm";

export default function FacultyAddPage({ params }) {
    const { category } = params
    return(
        <div>
            <PageTitle title="Create New Faculty Member"/>
            <FacultyForm category={category}/>
        </div>
    )
}
