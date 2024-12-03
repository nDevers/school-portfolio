import dynamic from 'next/dynamic';

const Hero = dynamic(() => import('@/components/section/home/Hero'), { ssr: true });
const AchievementShowcase = dynamic(() => import('@/components/section/home/AchievementShowcase'), { ssr: true });
const Notice = dynamic(() => import('@/components/section/home/Notice'), { ssr: true });
const Blog = dynamic(() => import('@/components/section/home/Blog'), { ssr: true });
const Speech = dynamic(() => import('@/components/section/home/Speech'), { ssr: true });
const Gallery = dynamic(() => import('@/components/section/home/Gallery'), { ssr: true });
const Info = dynamic(() => import('@/components/section/home/Info'), { ssr: true });

export default function Home() {
    return (
        <main>
            <Hero />
            <Speech />
            <Notice />
            <Info />
            <AchievementShowcase />
            <Blog />
            <Gallery />
        </main>
    );
}
