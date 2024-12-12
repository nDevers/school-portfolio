import List from './List';

export default function FacultyPage({ params }) {
    const { category } = params;
    
    return <List category={category}/>
}

// Return a list of `params` to populate the [id] dynamic segment
export async function generateStaticParams() {
    const data = ['teacher', 'ex-headteacher', 'board']
    return Array.isArray(data) ? data?.map((item) => ({
        category: encodeURIComponent(item),
    })) : [];
}