import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import AnimatedCounter from '@/components/common/AnimatedCounter';
import { FaAward, FaChalkboardTeacher, FaUserGraduate } from 'react-icons/fa'; // Icons from react-icons
import { MdSportsSoccer, MdLibraryBooks } from 'react-icons/md';

export default function AchievementShowcase() {
    const data = [
        {
            id: 1,
            number: 120,
            type: 'Awards Won',
            icon: <FaAward size={40} className="text-primary" />, // Icon for Awards
        },
        {
            id: 2,
            number: 50,
            type: 'Qualified Teachers',
            icon: <FaChalkboardTeacher size={40} className="text-primary" />, // Icon for Teachers
        },
        {
            id: 3,
            number: 300,
            type: 'Graduates This Year',
            icon: <FaUserGraduate size={40} className="text-primary" />, // Icon for Graduates
        },
        {
            id: 4,
            number: 15,
            type: 'Sports Championships',
            icon: <MdSportsSoccer size={40} className="text-primary" />, // Icon for Sports
        },
        {
            id: 5,
            number: 5000,
            type: 'Books in Library',
            icon: <MdLibraryBooks size={40} className="text-primary" />, // Icon for Library
        },
    ];

    return (
        <div
            className="w-full h-full bg-gradient-to-b from-primary to-background my-10"
            style={{
                background: 'linear-gradient(to bottom, var(--tw-gradient-from) 60%, var(--tw-gradient-to) 40%)',
            }}
        >
            <div className="h-1/3 grid place-content-center">
                <h1 className="py-4 text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-white font-bold font-satisfy">
                    Our School Achievements
                </h1>
            </div>
            <Card className="h-2/3 p-0 overflow-hidden max-w-7xl mx-auto">
                <CardContent className="w-full h-full grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 p-0">
                    {data?.map((item) => (
                        <div
                            key={item?.id}
                            className="w-full h-full flex flex-col items-center justify-center hover:bg-muted p-4"
                        >
                            <div className="mb-2">{item.icon}</div>
                            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-primary">
                                <AnimatedCounter from={0} to={item?.number} />
                            </p>
                            <p className="text-sm sm:text-base md:text-lg">{item?.type}</p>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
