'use client'
import { SketchButton } from '@/components/common/Buttons';
import SectionTitle from '@/components/common/SectionTitle';
import { Card } from '@/components/ui/card';
import React from 'react'
import { toast } from 'sonner';

export default function BecomeMember() {
    const benefits = [
        "Networking and maintaining connection with Computer Related Professionals of the Country",
        "Serving member with Special discounts",
        "Courses of Training & Development",
        "Conference Seminar and Workshop",
        "Trained Human Resources Development Recommendation",
        "Publications",
        "Work Abilities"
    ];
    return (
        <section className='sp'>
            <Card className='max-w-7xl mx-auto grid md:grid-cols-3 gap-4 md:gap-10 place-items-center p-2 sm:p-3 md:p-4 lg:p-6 overflow-hidden'>
                <div>
                    <SectionTitle title={'Benefits of Members'} />
                    <ul className='text-sm md:text-base space-y-2'>
                        {benefits?.map((i, idx) => (
                            <li key={idx}>{i}</li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h1 className='flex md:flex-col space-x-2 md:space-x-0 text-center uppercase text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold'>
                        <span>Become a</span>
                        <span className='text-primary'> member</span>
                    </h1>
                </div>
                <div className='w-full h-full relative'>
                    <div className='w-full md:w-fit md:absolute md:z-10 md:top-1/2 md:left-2/3 md:transform md:-translate-x-1/2 md:-translate-y-1/2'>
                        <SketchButton title='Apply Now' onClick={()=>toast?.success('hello')}/>
                    </div>
                    <div className='hidden lg:block absolute rotate-45 lg:-right-1/3 h-full lg:scale-150 aspect-square rounded-3xl bg-primary' />
                </div>
            </Card>
        </section>
    )
}
