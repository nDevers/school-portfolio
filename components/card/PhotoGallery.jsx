'use client';
import { useState } from 'react';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import Spinner from '@/components/common/Spinner';
import { cn } from '@/lib/utils';

export default function PhotoGallery({ imageUrls, className = 'grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1' }) {
    const [loading, setLoading] = useState(new Array(imageUrls.length).fill(true));

    const handleImageLoad = (index) => {
        setLoading((prev) => {
            const newLoadingState = [...prev];
            newLoadingState[index] = false;
            return newLoadingState;
        });
    };

    return (
        <PhotoProvider>
            <div className={cn(className)}>
                {imageUrls.map((src, index) => (
                    <div key={index} className="relative w-full h-full aspect-square overflow-hidden cursor-pointer">
                        {/* Loading Placeholder */}
                        {loading[index] && (
                            <div className="absolute inset-0 flex items-center justify-center bg-muted animate-pulse">
                                <Spinner/>
                            </div>
                        )}
                        {/* Image with Preview */}
                        <PhotoView src={src}>
                            <img
                                src={src}
                                alt={`Image ${index + 1}`}
                                className={`w-full h-full object-cover hover:contrast-125 hover:brightness-100 brightness-90 hover:scale-110 transition-all transform duration-300 ${loading[index] ? 'invisible' : 'visible'
                                    }`}
                                onLoad={() => handleImageLoad(index)}
                                onError={() => handleImageLoad(index)} // Fail-safe for load errors
                            />
                        </PhotoView>
                    </div>
                ))}
            </div>
        </PhotoProvider>
    )
}
