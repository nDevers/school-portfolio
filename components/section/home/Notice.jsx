import React from 'react';
import Link from 'next/link';
import SectionTitle from '@/components/common/SectionTitle';
import FileCard from '@/components/card/FileCard';
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
        <section>
            <div className='max-w-7xl mx-auto'>
                <div className='w-full h-full max-w-7xl mx-auto grid md:grid-cols-4 gap-4 md:gap-0'>
                    <div className='md:col-span-3 space-y-4 sp font-bengali'>
                        <SectionTitle title={'নোটিশ'} />
                        <div className='grid gap-2 md:gap-4 mb-4'>
                            {data?.map(item => (
                                <FileCard key={item?.id} item={item} />
                            ))}
                        </div>
                    </div>
                    <div className='flex flex-col'>
                        <div className='bg-muted divide-y flex flex-col flex-grow'>
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
                        <div> 
                            <Link href={'#'} className='bg-foreground/15 hover:bg-foreground/20 w-full p-2 md:p-4 flex'>Read More +</Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
