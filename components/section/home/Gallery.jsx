'use client';
import React from 'react';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import appConfig from '@/configs/appConfig';

export default function Gallery() {
    const images = [
        '/carousel/carousel (1).jpg',
        '/carousel/carousel (2).jpg',
        '/carousel/carousel (3).jpg',
        '/carousel/carousel (4).jpg',
        '/carousel/carousel (5).jpg',
        '/carousel/carousel (1).jpg',
        '/carousel/carousel (2).jpg',
        '/carousel/carousel (3).jpg',
        '/carousel/carousel (4).jpg',
        '/carousel/carousel (5).jpg',
    ];

    // Predefined sizes for grid items
    const predefinedSizes = [
        'col-span-2 row-span-2',
        'col-span-1 row-span-1',
        'col-span-1 row-span-2',
        'col-span-2 row-span-1',
    ];

    // Repeat images if needed to fill the grid
    const filledImages = Array.from({ length: Math.ceil(images.length / predefinedSizes.length) * predefinedSizes.length })
        .map((_, index) => images[index % images.length]);

    return (
        <div className="w-full h-full py-10">
            <div className="space-y-10">
                <h1 className="whitespace-nowrap text-3xl md:text-4xl text-center text-primary font-satisfy font-bold">
                    {appConfig.Title} at a Glance
                </h1>
                <PhotoProvider>
                    <div className="grid grid-flow-dense auto-rows-[1fr] grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-1">
                        {filledImages.map((src, index) => (
                            <PhotoView key={index} src={src}>
                                <div
                                    className={`flex overflow-hidden cursor-pointer ${
                                        predefinedSizes[index % predefinedSizes.length]
                                    }`}
                                >
                                    <img
                                        src={src}
                                        alt={`Image ${index + 1}`}
                                        className="object-cover hover:contrast-125 hover:brightness-100 brightness-90 hover:scale-110 transition-all transform duration-300"
                                    />
                                </div>
                            </PhotoView>
                        ))}
                    </div>
                </PhotoProvider>
            </div>
        </div>
    );
}
