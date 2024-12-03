import Link from "next/link";
import Marquee from "react-fast-marquee";

export default function MarqueeNotice() {
    const notices = [
        {
            id: 1,
            title: 'New feature released! Click here to learn more.',
            link: '#',
        },
        {
            id: 2,
            title: 'Check out our latest blog post on React best practices.',
            link: '#',
        },
        {
            id: 3,
            title: 'Join us for an exclusive webinar on Next.js performance tips.',
            link: '#',
        },
        {
            id: 4,
            title: 'We’re hiring! Check our careers page for open positions.',
            link: '#',
        },
        {
            id: 5,
            title: 'Download our new mobile app for enhanced features.',
            link: '#',
        },
    ];

    return (
        <div className="flex items-center text-sm md:text-base">
            {/* Notice Label */}
            <div className="hidden sm:block px-3 md:px-6 py-1 md:py-2 bg-secondary text-white font-bold">
                ঘোষণা
            </div>
            
            {/* Marquee with Notices */}
            <Marquee
                speed={40}
                delay={2}
                autoFill
                pauseOnHover
                direction="left">
                {notices.map((notice) => (
                    <Link
                        key={notice.id}
                        href={notice.link}
                        aria-label={`Link to notice ${notice.title}`}
                        className="hover:underline px-2 space-x-2">
                        <span>{notice.title}</span> <span>•</span>
                    </Link>
                ))}
            </Marquee>
        </div>
    );
}
