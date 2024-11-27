import PageTitle from '@/components/admin/common/PageTitle'
import OrganizationInfoForm from '@/components/admin/form/OrganizationInfoForm'
import apiConfig from '@/configs/apiConfig'
import { fetchDataAsServer } from '@/util/axios'

export default async function SettingsPage() {
  const generalInfo = await fetchDataAsServer(apiConfig?.GET_GENERAL_INFO)
  return (
    <div>
      <PageTitle title='Organization Information'/>
      <OrganizationInfoForm data={generalInfo}/>
    </div>
  )
}
