import InitiativesCard from "@/components/card/InitiativesCard"

export default function ProgramsPage() {
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {news.map(item => (
                <InitiativesCard key={item?.id} item={item}/>
            ))}
        </div>
    )
}
