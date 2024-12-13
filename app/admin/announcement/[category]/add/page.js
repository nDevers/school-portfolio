import PageTitle from "@/components/admin/common/PageTitle";
import AnnouncementForm from "@/components/admin/form/AnnouncementForm";

export default function AcademicAddPage({ params }) {
    const { category } = params
    return(
        <div>
            <PageTitle title="Create New Announcement"/>
            <AnnouncementForm category={category}/>
        </div>
    )
}
