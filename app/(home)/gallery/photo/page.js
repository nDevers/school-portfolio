'use client';
import React from 'react';
import apiConfig from '@/configs/apiConfig';
import PageTitle from '@/components/admin/common/PageTitle';
import PhotoGallery from '@/components/card/PhotoGallery';
import { useQuery } from '@tanstack/react-query';
import Spinner from '@/components/common/Spinner';

export default function PhotoGalleryPage() {
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
        <div className="w-full h-full max-w-7xl mx-auto sp my-6 space-y-6">
            <PageTitle title="ছবিতে আমাদের গল্প" />

            {isLoading && <Spinner/>}
            {imageUrls && <PhotoGallery imageUrls={imageUrls} />}
        </div>
    );
}
