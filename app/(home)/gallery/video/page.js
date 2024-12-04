'use client';
import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import { Dialog, DialogTrigger, DialogContent, DialogClose } from '@/components/ui/dialog';
import PageTitle from '@/components/admin/common/PageTitle';
import getYoutubeVideo from '@/util/getYoutubeVideo';

export default function VideoGalleryPage() {
    const [selectedVideo, setSelectedVideo] = useState(null);

    const videoUrls = [
        'https://www.youtube.com/watch?v=B4I5F4Li7v8',
        'https://www.youtube.com/watch?v=3JZ_D3ELwOQ',
        'https://www.youtube.com/watch?v=2Vv-BfVoq4g',
    ];

    return (
        <div className="w-full h-full max-w-7xl mx-auto sp my-6 space-y-6">
            <PageTitle title="ভিডিওতে আমাদের গল্প" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {videoUrls.map((videoUrl, index) => {
                    const videoId = getYoutubeVideo.id(videoUrl);
                    const thumbnailUrl = getYoutubeVideo.thumbnail(videoId);

                    return (
                        <Dialog key={index}>
                            <DialogTrigger asChild>
                                <div className="relative w-full aspect-video cursor-pointer">
                                    {/* Display YouTube Thumbnail */}
                                    <img
                                        src={thumbnailUrl}
                                        alt={`Thumbnail for Video ${index + 1}`}
                                        className="object-cover w-full h-full rounded-md hover:scale-105 transition-transform duration-300"
                                        onClick={() => setSelectedVideo(videoUrl)}
                                    />
                                </div>
                            </DialogTrigger>
                            <DialogContent className='w-full aspect-auto max-w-5xl bg-transparent p-0 border-none'>
                                {/* ReactPlayer */}
                                <div className="w-full h-full rounded-3xl overflow-hidden">
                                    <ReactPlayer
                                        url={selectedVideo}
                                        playing
                                        controls
                                        width="100%"
                                        height="100%"
                                        className="w-full aspect-video"
                                    />
                                </div>
                                <DialogClose asChild>
                                    {/* Custom Close Button */}
                                    <button
                                        className="absolute top-0 right-0 bg-black text-white rounded-full p-2 opacity-50 hover:opacity-100 transition-opacity"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            strokeWidth="2"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </button>
                                </DialogClose>
                            </DialogContent>
                        </Dialog>
                    );
                })}
            </div>
        </div>
    );
}
