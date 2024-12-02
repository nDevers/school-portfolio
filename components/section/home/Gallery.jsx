import appConfig from '@/configs/appConfig'
import React from 'react'

export default function Gallery() {
    return (
        <div className='w-full h-full py-10'>
            <div className='space-y-10'>
                <h1 className="uppercase whitespace-nowrap text-3xl md:text-4xl text-center">{appConfig.Title} at a glance</h1>
                <div className='grid grid-cols-2 lg:grid-cols-4'>
                    <div className='flex aspect-square overflow-hidden'>
                        <img
                            src="/carousel/carousel (1).jpg"
                            alt="Head of the Institute"
                            className='object-cover hover:brightness-100 brightness-90 hover:scale-105 transition-all transform duration-300'
                        />
                    </div>
                    <div className='flex aspect-square overflow-hidden'>
                        <img
                            src="/carousel/carousel (2).jpg"
                            alt="Head of the Institute"
                            className='object-cover hover:brightness-100 brightness-90 hover:scale-105 transition-all transform duration-300'
                        />
                    </div>
                    <div className='flex aspect-square overflow-hidden'>
                        <img
                            src="/carousel/carousel (3).jpg"
                            alt="Head of the Institute"
                            className='object-cover hover:brightness-100 brightness-90 hover:scale-105 transition-all transform duration-300'
                        />
                    </div>
                    <div className='flex aspect-square overflow-hidden'>
                        <img
                            src="/carousel/carousel (4).jpg"
                            alt="Head of the Institute"
                            className='object-cover hover:brightness-100 brightness-90 hover:scale-105 transition-all transform duration-300'
                        />
                    </div>
                    <div className='flex aspect-square overflow-hidden'>
                        <img
                            src="/carousel/carousel (4).jpg"
                            alt="Head of the Institute"
                            className='object-cover hover:brightness-100 brightness-90 hover:scale-105 transition-all transform duration-300'
                        />
                    </div>
                    <div className='flex aspect-square overflow-hidden'>
                        <img
                            src="/carousel/carousel (4).jpg"
                            alt="Head of the Institute"
                            className='object-cover hover:brightness-100 brightness-90 hover:scale-105 transition-all transform duration-300'
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
