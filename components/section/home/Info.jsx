import { Card, CardContent, CardHeader } from '@/components/ui/card';
import React from 'react';
import { PiCertificateDuotone, PiChalkboardTeacherDuotone, PiStudentDuotone } from 'react-icons/pi';

const InfoCard = ({ title, icon: Icon, items }) => (
    <Card>
        <CardHeader className="text-lg md:text-xl font-bold border-b p-4 px-8">
            {title}
        </CardHeader>
        <CardContent className="flex space-x-3">
            <Icon className="text-primary text-9xl" aria-label={`${title} আইকন`} />
            <ul className="space-y-2 pt-5">
                {items.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
        </CardContent>
    </Card>
);

export default function Info() {
    const cardData = [
        {
            title: 'ছাত্রছাত্রীদের তথ্য',
            icon: PiStudentDuotone,
            items: ['ভর্তি তথ্য', 'নোটিশ', 'রুটিন', 'কৃতি শিক্ষার্থী'],
        },
        {
            title: 'শিক্ষকদের তথ্য',
            icon: PiChalkboardTeacherDuotone,
            items: ['শিক্ষকবৃন্দ', 'প্রাক্তন প্রধান শিক্ষক', 'পরিচালনা পরিষদ'],
        },
        {
            title: 'একাডেমীক তথ্য',
            icon: PiCertificateDuotone,
            items: ['শূণ্যপদের তালিকা', 'ছুটির তালিকা', 'যানবাহন সুবিধা'],
        },
    ];

    return (
        <section className="sp">
            <div className="max-w-7xl mx-auto py-10 font-bengali">
                <h2 className="text-center text-2xl font-semibold md:text-3xl mb-8">
                    গুরুত্বপূর্ণ তথ্য
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {cardData.map((card, index) => (
                        <InfoCard
                            key={index}
                            title={card.title}
                            icon={card.icon}
                            items={card.items}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
