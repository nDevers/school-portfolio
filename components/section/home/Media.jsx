import NewsCard from "@/components/card/NewsCard"
import PhotoCard from "@/components/card/PhotoCard"
import VideoCard from "@/components/card/VideoCard"
import SectionTitle from "@/components/common/SectionTitle"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Media() {
    return (
        <section className='sp'>
            <div className='max-w-7xl mx-auto'>
                <Tabs defaultValue="news" className="w-full">
                    <div className='flex flex-col md:flex-row items-center justify-between'>
                        <SectionTitle title={'Media Gallery'} />
                        <TabsList>
                            <TabsTrigger value="news">News Room</TabsTrigger>
                            <TabsTrigger value="photo">Photo Gallery</TabsTrigger>
                            <TabsTrigger value="video">Video Gallery</TabsTrigger>
                        </TabsList>
                    </div>
                    <TabsContent value="news"> <NewsGrid/> </TabsContent>
                    <TabsContent value="photo"> <PhotoGrid/> </TabsContent>
                    <TabsContent value="video"> <VideoGrid/> </TabsContent>
                </Tabs>
            </div>
        </section>
    )
}

function NewsGrid() {
    const news = [
        {
            id: 1,
            title: 'News title sad asdsa dsadasd sa dsad sadsa dsadas dsa dsa dad saf afsa d asd sa',
            description: 'News Description sadas dsa dsa dsa dsadsa dsa dsa dsad sadsa dsadsa sadsa sa df asf ads sa dsad sad',
            date: '2024/10/23',
            img: '/carousel/carousel (1).jpg'
        },
        {
            id: 2,
            title: 'News title',
            description: 'News Description',
            date: '2024/10/23',
            img: '/carousel/carousel (2).jpg'
        },
        {
            id: 3,
            title: 'News title',
            description: 'News Description',
            date: '2024/10/23',
            img: '/carousel/carousel (3).jpg'
        },
    ]
    return (
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            {news.map(item => (
                <NewsCard key={item?.id} item={item}/>
            ))}
        </div>
    )
}

function PhotoGrid() {
    const photo = [
        {
            id: 1,
            title: 'Photo title',
            description: 'Photo Description sadas dsa dsa dsa dsadsa dsa dsa dsad sadsa dsadsa sadsa sa df asf ads sa dsad sad',
            date: '2024/10/23',
            img: '/carousel/carousel (4).jpg'
        },
        {
            id: 2,
            title: 'Photo title',
            description: 'Photo Description',
            date: '2024/10/23',
            img: '/carousel/carousel (3).jpg'
        },
        {
            id: 3,
            title: 'Photo title',
            description: 'Photo Description',
            date: '2024/10/23',
            img: '/carousel/carousel (1).jpg'
        },
    ]
    return (
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            {photo.map(item => (
                <PhotoCard key={item?.id} item={item}/>
            ))}
        </div>
    )
}

function VideoGrid() {
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
                <VideoCard key={item?.id} item={item}/>
            ))}
        </div>
    )
}
