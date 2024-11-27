import PhotoCard from '@/components/card/PhotoCard'

export default function PhotoGalleryPage() {
    const photos = [
        {
            year: 2024,
            images: [
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
        },
        {
            year: 2023,
            images: [
                {
                    id: 4,
                    title: 'Photo title',
                    description: 'Photo Description',
                    date: '2023/10/23',
                    img: '/carousel/carousel (1).jpg'
                },
            ]
        }
    ];

    return (
        <div>
            {photos.map(section => (
                <div key={section.year} className="mb-8">
                    <h2 className="text-xl font-bold mb-4">{section.year}</h2>
                    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                        {section.images.map(item => (
                            <PhotoCard key={item.id} item={item} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}