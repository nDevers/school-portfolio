import Hero from "@/components/section/home/Hero";
import AchievementShowcase from "@/components/section/home/AchievementShowcase";
import Notice from "@/components/section/home/Notice";
import Blog from "@/components/section/home/Blog";
import Speech from "@/components/section/home/Speech";
import Gallery from "@/components/section/home/Gallery";
import Info from "@/components/section/home/Info";

export default function Home() {
    return (
        <main>
            <Hero/>
            <Speech/>
            <Notice/>
            <AchievementShowcase/>
            <Info/>
            <Blog/>
            <Gallery/>
        </main>
    );
}
