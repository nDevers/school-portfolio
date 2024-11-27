import React from 'react';
import Link from 'next/link';
import SectionTitle from '@/components/common/SectionTitle';
import { InvertButton } from '@/components/common/Buttons';
import NoticeCard from '@/components/common/NoticeCard';

export default function Notice() {
    const data = [
        {
            id: 1,
            title: 'Exam Schedule Notice',
            date: '2024-10-17',
            file: '/files/exam-schedule.pdf', // Provide actual file path
        },
        {
            id: 2,
            title: 'Holiday Announcement',
            date: '2024-09-15',
            file: null, // No downloadable file for this notice
        },
        {
            id: 3,
            title: 'Meeting Notice',
            date: '2024-08-21',
            file: null, // No downloadable file for this notice
        },
        {
            id: 4,
            title: 'New Admission Circular',
            date: '2024-07-30',
            file: '/files/admission-circular.pdf', // Provide actual file path
        },
        {
            id: 5,
            title: 'Fee Payment Deadline',
            date: '2024-07-01',
            file: '/files/fee-payment-deadline.pdf', // Provide actual file path
        },
    ];

    return (
        <section className='sp'>
            <div className='max-w-7xl mx-auto'>
                <SectionTitle title={'Notice'} />
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-4 mb-4'>
                    {data?.map(item => (
                        <NoticeCard key={item?.id} item={item}/>
                    ))}
                </div>
                <div className='w-full flex items-center justify-center'>
                    <Link href={'/notice'}><InvertButton title='View All'/> </Link>
                </div>
            </div>
        </section>
    );
}
