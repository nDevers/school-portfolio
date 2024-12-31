'use client';
import apiConfig from '@/configs/apiConfig';
import PhotoGallery from '@/components/card/PhotoGallery';
import { useQuery } from '@tanstack/react-query';
import Spinner from '@/components/common/Spinner';

export default function Gallery() {
    // Function to fetch images
    const fetchImages = async () => {
        const response = await fetch(
            `https://api.unsplash.com/photos?query=school&client_id=${apiConfig.UNSPLASH_ACCESS_KEY}`
        );
        if (!response.ok) {
            throw new Error('Failed to fetch images');
        }
        const data = await response.json();
        return data.map((item) => item.urls.small);
    };

    // Fetch images using react-query
    const { isLoading, data: imageUrls } = useQuery({
        queryKey: ['images'],
        queryFn: fetchImages,
    });

    return (
        <div className='w-full h-full pt-10'>
            <div className='space-y-10'>
                <h1 className='whitespace-nowrap text-3xl md:text-4xl text-center text-primary font-bold'>
                    এক নজরে আমাদের স্কুল
                </h1>

                {isLoading && <Spinner />}
                {imageUrls && (
                    <PhotoGallery
                        imageUrls={imageUrls}
                        className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1'
                    />
                )}
            </div>
        </div>
    );
}
