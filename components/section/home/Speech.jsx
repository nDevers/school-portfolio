import Link from 'next/link';
import React from 'react';

export default function Speech() {
    return (
        <div className="w-full h-full">
            <div className="w-full h-full max-w-7xl mx-auto grid md:grid-cols-4 gap-4 md:gap-0">
                <div className="md:col-span-3 space-y-6 pt-10 px-2">
                    <h1 className="uppercase whitespace-nowrap text-lg md:text-xl">
                        Head of the Institute
                    </h1>
                    <div className="flex space-x-4">
                        <img
                            src="/carousel/carousel (1).jpg"
                            alt="Head of the Institute"
                            className="w-36 h-52 md:w-52 md:h-60 object-cover"
                        />
                        <div className="space-y-2">
                            <h2 className="font-bold md:text-lg">
                                Headmaster Name
                            </h2>
                            <p className="line-clamp-6 text-justify">
                                Lorem ipsum, dolor sit amet consectetur
                                adipisicing elit. Illo commodi ad dignissimos
                                quidem doloremque libero accusamus, aperiam
                                molestias? Facilis quaerat dolorem aspernatur
                                nulla, nihil reprehenderit laboriosam excepturi
                                quo voluptas ab. Lorem ipsum, dolor sit amet
                                consectetur adipisicing elit. Illo commodi ad
                                dignissimos quidem doloremque libero accusamus,
                                aperiam molestias? Facilis quaerat dolorem
                                aspernatur nulla, nihil reprehenderit laboriosam
                                excepturi quo voluptas ab. Lorem ipsum, dolor
                                sit amet consectetur adipisicing elit. Illo
                                commodi ad dignissimos quidem doloremque libero
                                accusamus, aperiam molestias? Facilis quaerat
                                dolorem aspernatur nulla, nihil reprehenderit
                                laboriosam excepturi quo voluptas ab. Lorem
                                ipsum, dolor sit amet consectetur adipisicing
                                elit. Illo commodi ad dignissimos quidem
                                doloremque libero accusamus, aperiam molestias?
                                Facilis quaerat dolorem aspernatur nulla, nihil
                                reprehenderit laboriosam excepturi quo voluptas
                                ab.
                            </p>
                            <div className="flex items-end justify-end text-xs">
                                <Link
                                    href={'/academic/speech'}
                                    className="hover:underline"
                                >
                                    Read More
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-muted divide-y">
                    <h1 className="p-2 md:p-4 uppercase whitespace-nowrap text-lg md:text-xl text-primary">
                        More About Us
                    </h1>
                    <Link
                        href={'#'}
                        className="block p-2 md:p-4 hover:underline hover:text-blue-500"
                    >
                        <span>HOMEWORK PLANS</span>
                    </Link>
                    <Link
                        href={'#'}
                        className="block p-2 md:p-4 hover:underline hover:text-blue-500"
                    >
                        <span>PRACTICAL LIFE IN SCHOOL</span>
                    </Link>
                    <Link
                        href={'#'}
                        className="block p-2 md:p-4 hover:underline hover:text-blue-500"
                    >
                        <span>STOP BULLYING NOW</span>
                    </Link>
                    <Link
                        href={'#'}
                        className="block p-2 md:p-4 hover:underline hover:text-blue-500"
                    >
                        <span>CHILD ATTENDANCE</span>
                    </Link>
                    <Link
                        href={'#'}
                        className="block p-2 md:p-4 hover:underline hover:text-blue-500"
                    >
                        <span>REGISTRATION DOCUMENTS</span>
                    </Link>
                    <Link
                        href={'#'}
                        className="block p-2 md:p-4 hover:underline hover:text-blue-500"
                    >
                        <span>BEFORE AND AFTER SCHOOL</span>
                    </Link>
                    <Link
                        href={'#'}
                        className="block p-2 md:p-4 hover:underline hover:text-blue-500"
                    >
                        <span>LAUNCH MENU</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
