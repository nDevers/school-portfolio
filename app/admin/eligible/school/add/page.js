import PageTitle from '@/components/admin/common/PageTitle'
import EligibleSchoolForm from '@/components/admin/form/EligibleSchoolForm'

export default async function EligibleSchoolAddPage() {
  return (
    <div className='space-y-4'>
      <PageTitle title='Create New Eligible Schools'/>
      <EligibleSchoolForm/>
    </div>
  )
}
