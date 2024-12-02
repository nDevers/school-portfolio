import React from 'react';
import Link from 'next/link';
import SectionTitle from '@/components/common/SectionTitle';
import { InvertButton } from '@/components/common/Buttons';
import NoticeCard from '@/components/common/NoticeCard';
import LinkGradient from '@/components/common/LinkGradient';

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

    const links = [
        { href: '#', title: 'Apply Now', description: 'Class 1-5' },
        { href: '#', title: 'Apply Now', description: 'Class 6-9' },
        { href: '#', title: 'Career', description: 'Bangla Teacher' },
    ];

    return (
        <section className='sp'>
            <div className='max-w-7xl mx-auto'>
                <div className='w-full h-full max-w-7xl mx-auto grid md:grid-cols-4 gap-4 md:gap-0'>
                    <div className='md:col-span-3 space-y-4 pt-4 px-2'>
                        <SectionTitle title={'Notice'} />
                        <div className='grid gap-2 md:gap-4 mb-4'>
                            {data?.map(item => (
                                <NoticeCard key={item?.id} item={item} />
                            ))}
                        </div>
                        <div className='w-full'>
                            <Link href={'/notice'}><InvertButton title='View All' /> </Link>
                        </div>
                    </div>
                    <div className='bg-muted divide-y'>
                        <h1 className="p-2 md:p-4 uppercase whitespace-nowrap text-lg md:text-xl text-primary">Open Now</h1>
                        {links.map((link, index) => (
                            <LinkGradient
                                key={index}
                                index={index}
                                href={link.href}
                                title={link.title}
                                description={link.description}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
