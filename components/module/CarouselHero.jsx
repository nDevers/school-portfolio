'use client';

import { useRef } from 'react';
import { Card } from '@/components/ui/card';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

export default function CarouselHero() {
    const plugin = useRef(Autoplay({ delay: 4000, stopOnInteraction: false }));

    const data = [
        {
            id: '1',
            image: '/carousel/carousel (1).jpg',
        },
        {
            id: '2',
            image: '/carousel/carousel (2).jpg',
        },
        {
            id: '3',
            image: '/carousel/carousel (3).jpg',
        },
        {
            id: '4',
            image: '/carousel/carousel (4).jpg',
        },
        {
            id: '5',
            image: '/carousel/carousel (5).jpg',
        },
    ];

    return (
        <div className='w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[400px] xl:h-[450px]'>
            <Carousel
                opts={{ loop: true }}
                plugins={[plugin.current]}
                className='w-full h-full grid'
            >
                <div className='w-full relative'>
                    <CarouselPrevious className='absolute z-10 top-1/2 left-10 opacity-30 hover:opacity-100' />
                    <CarouselNext className='absolute z-10 top-1/2 right-10 opacity-30 hover:opacity-100' />
                    <CarouselContent>
                        {data.map((item) => (
                            <CarouselItem key={item?.id}>
                                <div className='w-full h-full'>
                                    <Card className='w-full h-full overflow-hidden rounded-none'>
                                        <div className='relative w-full h-full flex flex-col'>
                                            <img
                                                src={item?.image}
                                                alt={`${item?.title}'s image`}
                                                className='flex-grow object-cover h-48 w-full' // Adjust height as needed
                                            />
                                        </div>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </div>
            </Carousel>
        </div>
    );
}
