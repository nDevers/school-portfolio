import Link from "next/link";
import { BiAward, BiSolidBookBookmark, BiWifi } from "react-icons/bi";
import { BsArrowRightCircleFill } from "react-icons/bs";

export default function Intro() {
    return (
        <div className='w-full h-full bg-zinc-700 dark:bg-zinc-200 text-background'>
            <div className='w-full h-full max-w-7xl mx-auto grid grid-cols-4'>
                <IntroCard
                    icon={
                        <div className="w-16 aspect-square bg-yellow-500 grid place-items-center">
                            <BiSolidBookBookmark size={40} />
                        </div>
                    }
                    title={'Programs'}
                    description={'Begin with Class 6, Ends SSC Final'}
                />
                <IntroCard
                    icon={
                        <div className="w-16 aspect-square bg-sky-600 grid place-items-center">
                            <BiWifi size={40} />
                        </div>
                    }
                    title={'ONLINE EDU'}
                    description={'Processes and all main lorem ipsum.'}
                />
                <IntroCard
                    icon={
                        <div className="w-16 aspect-square bg-fuchsia-600 grid place-items-center">
                            <BiAward size={40} />
                        </div>
                    }
                    title={'Awards'}
                    description={'Cycles of time to be explored.'}
                />
                <Link href={'#'} className="group w-full h-full grid place-content-center bg-yellow-500">
                    <div className="h-16 gap-2">
                        <div className="text-lg md:text-xl">Don't Hestitate to Ask</div>
                        <div className="uppercase group-hover:space-x-4 transition-all transform duration-200 flex items-center space-x-2 text-2xl">
                            <span>Contact us</span>
                            <BsArrowRightCircleFill />
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    )
}

function IntroCard({ icon, title, description }) {
    return (
        <div className='w-full h-full grid place-content-center'>
            <div className="flex items-start gap-2">
                <div>{icon}</div>
                <div className="space-y-2">
                    <h1 className="uppercase text-lg md:text-xl">{title}</h1>
                    <p className="text-xs opacity-60 md:text-sm">{description}</p>
                </div>
            </div>
        </div>
    )
}

