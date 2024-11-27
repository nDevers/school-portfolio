'use client'
import PageTitle from "@/components/admin/common/PageTitle";
import Spinner from "@/components/common/Spinner";
import AboutForm from "@/components/form/AboutForm";
import apiConfig from "@/configs/apiConfig";
import { fetchData } from "@/util/axios";
import { useQuery } from "@tanstack/react-query";

export default function AboutMembershipCriteriaPage() {

    const { isLoading, data, isRefetching, refetch } = useQuery({
        queryKey: ['aboutMembershipCriteria'],
        queryFn: () => fetchData(apiConfig?.GET_MEMBERSHIP_CRITERIA),
    });

    const updateAPI = apiConfig?.MEMBERSHIP_CRITERIA;
    const createAPI = apiConfig?.MEMBERSHIP_CRITERIA;

    return isLoading || isRefetching ? <Spinner/> : (
        <div>
            <PageTitle title="About Membership Criteria"/>
            <AboutForm data={data} refetch={refetch} updateAPI={updateAPI} createAPI={createAPI}/>
        </div>
    )
}
