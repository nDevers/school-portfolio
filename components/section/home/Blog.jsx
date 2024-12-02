import BlogCard from "@/components/card/BlogCard"
import { InvertButton, SimpleButton, SketchButton } from "@/components/common/Buttons"
import SectionTitle from "@/components/common/SectionTitle"

export default function Blog() {
    const blogs = [
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
        {
            id: 4,
            title: 'News title',
            description: 'News Description',
            date: '2024/10/23',
            img: '/carousel/carousel (4).jpg'
        },
    ]
    return (
        <section className='sp'>
            <div className='max-w-7xl mx-auto py-10'>
                <SectionTitle title={'Blogs'} />
                <div className='flex flex-col md:flex-row items-center justify-between pb-4'>
                    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                        {blogs.map(item => (
                            <BlogCard key={item?.id} item={item} />
                        ))}
                    </div>
                </div>
                <InvertButton title='View more'/>
            </div>
        </section>
    )
}