'use client'
import PageTitle from "@/components/admin/common/PageTitle";
import LegalDocumentsForm from "@/components/form/LegalDocumentsForm";
import { toast } from "sonner";

export default function LegalDocumentsPage() {

    const initialValues = {
        title: 'Aim and Objective title',
        banner: null,
        description: 'Aim and Objective description',
    }

    const onSubmit = async (values) => {
        const formData = new FormData()
        formData.append('title', values.title)
        formData.append('banner', values.banner)
        formData.append('description', values.description)

        try {
            toast.success(`Submitted data: ${JSON.stringify(values)}`)
        } catch (error) {
            toast.error("Failed to submit form")
        }
    }

    return (
        <div>
            <PageTitle title="Legal Documents"/>
            <LegalDocumentsForm data={initialValues} onSubmit={onSubmit}/>
        </div>
    )
}
