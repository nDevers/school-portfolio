import Hero from "@/components/section/home/Hero";
import BecomeMember from "@/components/section/home/BecomeMember";
import AchievementShowcase from "@/components/section/home/AchievementShowcase";
import Event from "@/components/section/home/Event";
import Message from "@/components/section/home/Message";
import Notice from "@/components/section/home/Notice";
import Media from "@/components/section/home/Media";
import EventAndNotice from "@/components/section/home/EventAndNotice";

export default function Home() {
    return (
        <main>
            <Hero/>
            <EventAndNotice/>
            <BecomeMember/>
            <AchievementShowcase/>
            <Event/>
            <Message/>
            <Notice/>
            <Media/>
        </main>
    );
}
