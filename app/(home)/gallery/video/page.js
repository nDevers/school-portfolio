'use client';
import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import { Dialog, DialogTrigger, DialogContent, DialogClose } from '@/components/ui/dialog'; // Adjust the import path based on your setup
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
              <DialogContent className='max-w-5xl w-full aspect-video'>
                <ReactPlayer
                  url={selectedVideo}
                  playing
                  controls
                  width="100%"
                  height="100%"
                />
                <DialogClose/>
              </DialogContent>
            </Dialog>
          );
        })}
      </div>
    </div>
  );
}
