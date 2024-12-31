import Link from 'next/link';
import {
    BiAward,
    BiBookReader,
    BiCalendar,
    BiSolidBookBookmark,
    BiWifi,
} from 'react-icons/bi';
import { BsArrowRightCircleFill } from 'react-icons/bs';

export default function Intro() {
    return (
        <div className='w-full h-full bg-muted'>
            <div className='w-full h-full max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4'>
                <IntroCard
                    icon={
                        <div className='text-2xl md:text-4xl w-10 md:w-16 aspect-square bg-yellow-500 text-white grid place-items-center'>
                            <BiCalendar />
                        </div>
                    }
                    title={'FOUNDED 1956'}
                    description={
                        'Outdoor learning and tending to our school garden is a big part of our day emotional growth and self.'
                    }
                />
                <IntroCard
                    icon={
                        <div className='text-2xl md:text-4xl w-10 md:w-16 aspect-square bg-sky-600 text-white grid place-items-center'>
                            <BiBookReader />
                        </div>
                    }
                    title={'STUDENTS: 150'}
                    description={
                        'This age group is playing their way to greater independence, socio-emotional growth and self'
                    }
                />
                <IntroCard
                    icon={
                        <div className='text-2xl md:text-4xl w-10 md:w-16 aspect-square bg-fuchsia-600 text-white grid place-items-center'>
                            <BiAward />
                        </div>
                    }
                    title={'GRADUATION RATE 100%'}
                    description={
                        'Children in this classroom are working on forging social skills through emotional growth and self'
                    }
                />
                <Link
                    href={'/contact'}
                    className='group w-full h-full grid place-content-center bg-yellow-500 text-white'
                >
                    <div className='h-full gap-2'>
                        <div className='text-xs md:text-sm'>
                            Don't Hestitate to Ask
                        </div>
                        <div className='uppercase flex items-center space-x-2 font-bold text-lg md:text-3xl'>
                            <span>Contact us</span>
                            <BsArrowRightCircleFill />
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
}

function IntroCard({ icon, title, description }) {
    return (
        <div className='w-full h-full py-2'>
            <div className='flex items-start gap-2'>
                <div>{icon}</div>
                <div className='md:space-y-2 px-2'>
                    <h1 className='uppercase text-base md:text-xl'>{title}</h1>
                    <p className='text-xs opacity-60 md:text-sm'>
                        {description}
                    </p>
                </div>
            </div>
        </div>
    );
}
