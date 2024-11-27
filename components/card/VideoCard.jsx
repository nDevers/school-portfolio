import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import getYoutubeVideo from "@/util/getYoutubeVideo";
import Link from "next/link";
import { HiOutlineCalendar } from "react-icons/hi";

export default function VideoCard({ item }) {

    // Extracted YouTube video ID from the provided URL
    const videoId = getYoutubeVideo.id(item?.youtubeId);
    const videoThumbnail = getYoutubeVideo.thumbnail(videoId)

    return (
        <Card className='overflow-hidden group'>
            <div className='w-full aspect-video overflow-hidden'>
                {videoId ? (
                    // <iframe
                    //     width="100%"
                    //     height="100%"
                    //     src={`https://www.youtube.com/embed/${videoId}`}
                    //     title={item?.title}
                    //     frameBorder="0"
                    //     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    //     allowFullScreen
                    //     className='w-full h-full object-cover group-hover:scale-105 transition-all transform duration-200'
                    // />

                    <Link href={item?.youtubeId} target="_blank">
                        <img
                            src={videoThumbnail}
                            alt="YouTube Thumbnail"
                            className="w-full h-full object-cover cursor-pointer rounded-md shadow-md hover:opacity-80"
                        />
                    </Link>
                ) : (
                    <p>Invalid YouTube link</p>
                )}
            </div>
            <div className='p-1 md:p-2 space-y-2'>
                <div className='flex items-end justify-end'>
                    <Badge variant="outline" className='space-x-2'>
                        <HiOutlineCalendar />
                        <span>{item?.date}</span>
                    </Badge>
                </div>
                <p className='md:text-lg lg:text-xl line-clamp-1 hover:underline'>{item?.title}</p>
                <p className='text-xs md:text-sm line-clamp-2'>{item?.description}</p>
            </div>
        </Card>
    );
}
