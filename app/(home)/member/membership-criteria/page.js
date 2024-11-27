import CoverAbout from '@/components/common/CoverAbout'
import React from 'react'

export default function AboutMembership() {
    const data = {
        title: 'Membership Criteria',
        cover: '/carousel/carousel (4).jpg',
        description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Laborum consequatur obcaecati, excepturi beatae dolorum nostrum odit tenetur ut minus atque doloribus ratione itaque, est quae quaerat odio libero omnis illo.'
    }
    return (
        <div className='space-y-10'>
            <CoverAbout data={data} />
            <div className='text-base sm:text-lg md:text-xl lg:text-2xl'>
                <p>{data?.description}</p>
            </div>
        </div>
    )
  }
  