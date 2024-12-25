import { getNavigationData } from '@/data/navigationData';
import Link from 'next/link';

export default function Layout({ children }) {
    const routine = getNavigationData('রুটিন');
    const result = getNavigationData('ফলাফল');
    const notice = getNavigationData('নোটিশ');
    const admission = getNavigationData('ভর্তি');
    return (
        <div className="w-full h-full max-w-7xl mx-auto grid md:grid-cols-4 gap-4 md:gap-0">
            <div className="md:col-span-3 space-y-4">{children}</div>
            <div className="bg-muted divide-y flex flex-col flex-grow">
                <h1 className="p-2 md:p-4 uppercase whitespace-nowrap text-lg md:text-xl text-primary">
                    আরও দেখুন
                </h1>
                <Link
                    href={routine[0]?.href}
                    className="block p-2 md:p-4 hover:underline hover:text-blue-500 hover:bg-primary/10"
                >
                    <span>{routine[0]?.title}</span>
                </Link>
                <Link
                    href={result[0]?.href}
                    className="block p-2 md:p-4 hover:underline hover:text-blue-500 hover:bg-primary/10"
                >
                    <span>{result[0]?.title}</span>
                </Link>
                <Link
                    href={notice[0]?.href}
                    className="block p-2 md:p-4 hover:underline hover:text-blue-500 hover:bg-primary/10"
                >
                    <span>{notice[0]?.title}</span>
                </Link>
                {admission[0]?.subItems?.map((item, index) => (
                    <Link
                        key={index}
                        href={item.href}
                        className="block p-2 md:p-4 hover:underline hover:text-blue-500 hover:bg-primary/10"
                    >
                        <span>{item.title}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
