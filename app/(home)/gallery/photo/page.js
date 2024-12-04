'use client';
import React, { useState, useEffect } from 'react';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import apiConfig from '@/configs/apiConfig';
import PageTitle from '@/components/admin/common/PageTitle'

export default function PhotoGalleryPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState([]);

  useEffect(() => {
    // Fetch images from an API (e.g., Unsplash)
    const fetchImages = async () => {
      try {
        const response = await fetch(
          `https://api.unsplash.com/photos?query=school&client_id=${apiConfig.UNSPLASH_ACCESS_KEY}`
        );
        const data = await response.json();
        const imageUrls = data.map((item) => item.urls.small);
        setImages(imageUrls);
        setLoading(new Array(imageUrls.length).fill(true));
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, []);

  const handleImageLoad = (index) => {
    setLoading((prev) => {
      const newLoadingState = [...prev];
      newLoadingState[index] = false;
      return newLoadingState;
    });
  };
  return (
    <div className="w-full h-full max-w-7xl mx-auto sp my-6 space-y-6">
      <PageTitle title="ছবিতে আমাদের গল্প" />
      <PhotoProvider>
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1">
          {images.map((src, index) => (
            <div key={index}>
              <div className="relative w-full h-full aspect-square overflow-hidden cursor-pointer">
                {loading[index] && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse">
                    <div className="w-8 h-8 border-4 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                <PhotoView src={src}>
                  <img
                    src={src}
                    alt={`Image ${index + 1}`}
                    className={`object-cover hover:contrast-125 hover:brightness-100 brightness-90 hover:scale-110 transition-all transform duration-300 ${loading[index] ? 'invisible' : 'visible'
                      }`}
                    onLoad={() => handleImageLoad(index)}
                    onError={() => handleImageLoad(index)} // Fail-safe for load errors
                  />
                </PhotoView>
              </div>
            </div>
          ))}
        </div>
      </PhotoProvider>
    </div>
  )
}
