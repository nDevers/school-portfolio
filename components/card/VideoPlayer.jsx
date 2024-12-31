'use client';
import React, { useState, useMemo } from 'react';
import ReactPlayer from 'react-player';
import getYoutubeVideo from '@/util/getYoutubeVideo';
import { HiPlay } from 'react-icons/hi';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function VideoPlayer({ videoUrl }) {
    const [selectedVideo, setSelectedVideo] = useState(null);

    // Memoize video ID and thumbnail generation
    const { videoId, thumbnailUrl } = useMemo(() => {
        const id = getYoutubeVideo.id(videoUrl);
        const thumbnail = getYoutubeVideo.thumbnail(id);
        return { videoId: id, thumbnailUrl: thumbnail };
    }, [videoUrl]);

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <div
                    className='relative group w-full aspect-video cursor-pointer'
                    onClick={() => setSelectedVideo(videoUrl)}
                >
                    {/* Display YouTube Thumbnail */}
                    <img
                        src={thumbnailUrl}
                        alt={`Thumbnail for Video`}
                        className='object-cover w-full h-full rounded-md group-hover:scale-105 transition-transform duration-300'
                    />
                    <HiPlay className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-background text-6xl scale-0 group-hover:scale-100 transition-transform duration-200 opacity-0 group-hover:opacity-50' />
                </div>
            </AlertDialogTrigger>

            {/* Modal for Video Player */}
            <AlertDialogContent className='w-full aspect-auto max-w-5xl bg-transparent p-0 border-none'>
                {/* ReactPlayer */}
                <div className='w-full h-full rounded-3xl overflow-hidden'>
                    <ReactPlayer
                        url={selectedVideo}
                        playing
                        controls
                        width='100%'
                        height='100%'
                        className='w-full aspect-video'
                    />
                </div>

                {/* Custom Close Button */}
                <AlertDialogCancel
                    asChild
                    className='absolute top-0 right-0 bg-black text-white rounded-full p-2 opacity-50 hover:opacity-100 transition-opacity'
                >
                    <button
                    // className="absolute top-0 right-0 bg-black text-white rounded-full p-2 opacity-50 hover:opacity-100 transition-opacity"
                    // onClick={() => setSelectedVideo(null)} // Close the video
                    >
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='h-5 w-5'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                            strokeWidth='2'
                        >
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                d='M6 18L18 6M6 6l12 12'
                            />
                        </svg>
                    </button>
                </AlertDialogCancel>
            </AlertDialogContent>
        </AlertDialog>
    );
}
