import CarouselHero from '@/components/module/CarouselHero';
import Intro from '@/components/module/Intro';

export default function Hero() {
    return (
        <section className="w-full h-full">
            <div className="w-full h-3/4">
                <CarouselHero />
            </div>
            <div className="w-full h-1/4">
                <Intro />
            </div>
        </section>
    );
}
