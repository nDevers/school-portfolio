import React from 'react';
import AnimatedCounter from '@/components/common/AnimatedCounter';
import { FaAward, FaChalkboardTeacher, FaUserGraduate } from 'react-icons/fa';
import { MdSportsSoccer, MdLibraryBooks } from 'react-icons/md';

export default function AchievementShowcase() {
    const data = [
        {
            id: 1,
            number: 120,
            type: 'Awards Won',
            icon: <FaAward />,
        },
        {
            id: 2,
            number: 50,
            type: 'Qualified Teachers',
            icon: <FaChalkboardTeacher />,
        },
        {
            id: 3,
            number: 300,
            type: 'Graduates This Year',
            icon: <FaUserGraduate />,
        },
        {
            id: 4,
            number: 15,
            type: 'Sports Championships',
            icon: <MdSportsSoccer />,
        },
        {
            id: 5,
            number: 5000,
            type: 'Books in Library',
            icon: <MdLibraryBooks />,
        },
    ];

    return (
        <div className="w-full h-full bg-muted py-10 space-y-10 my-10">
            <div className="h-1/3 grid place-content-center">
                <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-primary font-bold font-satisfy">
                    Our School Achievements
                </h1>
            </div>
            <div className="h-2/3 p-0 overflow-hidden max-w-7xl mx-auto">
                <div className="w-full h-full grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 p-2 gap-2">
                    {data?.map((item) => (
                        <div key={item.id} className="flex items-start gap-2">
                            <div className="text-xl md:text-2xl lg:text-4xl w-10 md:w-16 aspect-square bg-yellow-500 text-white grid place-items-center">
                                {item.icon}
                            </div>
                            <div className="md:space-y-2 px-2">
                                <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold">
                                    <AnimatedCounter
                                        from={0}
                                        to={item?.number}
                                    />
                                </h1>
                                <p className="text-xs opacity-80 md:text-sm">
                                    {item?.type}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
