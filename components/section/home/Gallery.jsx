'use client';
import React, { useState, useEffect } from 'react';
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

    const predefinedSizes = [
        'col-span-2 row-span-2',
        'col-span-1 row-span-1',
        'col-span-1 row-span-2',
        'col-span-2 row-span-1',
    ];

    const filledImages = Array.from({ length: Math.ceil(images.length / predefinedSizes.length) * predefinedSizes.length })
        .map((_, index) => images[index % images.length]);

    const [loading, setLoading] = useState(new Array(filledImages.length).fill(true));

    useEffect(() => {
        // Check if images are already cached and loaded
        filledImages.forEach((src, index) => {
            const img = new Image();
            img.src = src;
            img.onload = () => handleImageLoad(index);
            img.onerror = () => handleImageLoad(index); // Fail-safe for load errors
        });
    }, []);

    const handleImageLoad = (index) => {
        setLoading((prev) => {
            const newLoadingState = [...prev];
            newLoadingState[index] = false;
            return newLoadingState;
        });
    };

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
                                    className={`relative flex overflow-hidden cursor-pointer ${
                                        predefinedSizes[index % predefinedSizes.length]
                                    }`}
                                >
                                    {loading[index] && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse">
                                            <div className="w-8 h-8 border-4 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                    )}
                                    <img
                                        src={src}
                                        alt={`Image ${index + 1}`}
                                        className={`object-cover hover:contrast-125 hover:brightness-100 brightness-90 hover:scale-110 transition-all transform duration-300 ${
                                            loading[index] ? 'invisible' : 'visible'
                                        }`}
                                        onLoad={() => handleImageLoad(index)}
                                        onError={() => handleImageLoad(index)}
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
