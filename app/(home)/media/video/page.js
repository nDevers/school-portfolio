import VideoCard from '@/components/card/VideoCard'
import React from 'react'

export default function VideoGalleryPage() {
    const video = [
        {
            id: 1,
            title: 'Video title',
            description: 'Video Description sadas dsa dsa dsa dsadsa dsa dsa dsad sadsa dsadsa sadsa sa df asf ads sa dsad sad',
            date: '2024/10/23',
            youtubeId: 'https://www.youtube.com/watch?v=cHBqwj0Ed_I'
        },
        {
            id: 2,
            title: 'Video title',
            description: 'Video Description',
            date: '2024/10/23',
            youtubeId: 'https://youtu.be/svP_YGUVG_g?si=BOFjEqoflFhmsOzG'
        },
    ]
    return (
        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {video.map(item => (
                <VideoCard key={item?.id} item={item} />
            ))}
        </div>
    )
}
