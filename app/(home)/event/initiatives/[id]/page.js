import CoverAbout from '@/components/common/CoverAbout';
import Link from 'next/link';
import React from 'react'

export default function InitiativesDetailsPage({params}) {
    const { id } = params;
    const data = {
        title: id,
        cover: '/carousel/carousel (1).jpg',
        description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Laborum consequatur obcaecati, excepturi beatae dolorum nostrum odit tenetur ut minus atque doloribus ratione itaque, est quae quaerat odio libero omnis illo.'
    }
  return (
    <div className='space-y-10'>
        <CoverAbout data={data} />
        <div className='md:text-base'>
            <Link href={`/application/${id}`}>Apply</Link>
            <p>{data?.description}</p>
        </div>
    </div>
  )
}
