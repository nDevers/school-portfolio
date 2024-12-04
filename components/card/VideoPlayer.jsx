'use client';
import React, { useState, useMemo } from 'react';
import ReactPlayer from 'react-player';
import { Dialog, DialogTrigger, DialogContent, DialogClose } from '@/components/ui/dialog';
import getYoutubeVideo from '@/util/getYoutubeVideo';

export default function VideoPlayer({ videoUrl }) {
    const [selectedVideo, setSelectedVideo] = useState(null);

    // Memoize video ID and thumbnail generation
    const { videoId, thumbnailUrl } = useMemo(() => {
        const id = getYoutubeVideo.id(videoUrl);
        const thumbnail = getYoutubeVideo.thumbnail(id);
        return { videoId: id, thumbnailUrl: thumbnail };
    }, [videoUrl]);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="relative w-full aspect-video cursor-pointer">
                    {/* Display YouTube Thumbnail */}
                    <img
                        src={thumbnailUrl}
                        alt={`Thumbnail for Video`}
                        className="object-cover w-full h-full rounded-md hover:scale-105 transition-transform duration-300"
                        onClick={() => setSelectedVideo(videoUrl)}
                    />
                </div>
            </DialogTrigger>

            {/* Modal for Video Player */}
            <DialogContent className="w-full aspect-auto max-w-5xl bg-transparent p-0 border-none">
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

                {/* Custom Close Button */}
                <DialogClose asChild>
                    <button
                        className="absolute top-0 right-0 bg-black text-white rounded-full p-2 opacity-50 hover:opacity-100 transition-opacity"
                        onClick={() => setSelectedVideo(null)} // Close the video
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
    )
}
