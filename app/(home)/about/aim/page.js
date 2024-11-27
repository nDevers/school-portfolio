'use client'
import CoverAbout from '@/components/common/CoverAbout'
import Spinner from '@/components/common/Spinner';
import apiConfig from '@/configs/apiConfig';
import { fetchData } from '@/util/axios';
import { useQuery } from '@tanstack/react-query';
import React from 'react'

export default function AboutAimPage() {
    const { isLoading, data } = useQuery({
        queryKey: ['aim'],
        queryFn: () => fetchData(apiConfig?.GET_ABOUT_AIM_OBJECTIVE),
    });
    return isLoading ? <Spinner/> : (
        <div className='space-y-10'>
            <CoverAbout data={data} />
            <div className='md:text-base sun-editor-content'>
                {/* Rendering HTML content from description */}
                <div dangerouslySetInnerHTML={{ __html: data?.description }} />
            </div>
        </div>
    )
}
