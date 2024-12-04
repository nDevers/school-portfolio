'use client'
import React from 'react'
import { MdLocationOn, MdPhone, MdWork } from 'react-icons/md'
import { PhotoProvider, PhotoView } from 'react-photo-view'

export default function AcademicProfileCard({ profile }) {
    return (
        <PhotoProvider>
            <div className='border w-fit mx-auto'>
                <div src={profile?.image} className='w-full h-60 overflow-hidden'>
                    <PhotoView src={profile?.image}>
                        <img 
                            src={profile?.image} 
                            alt="profile" 
                            className='w-full h-full object-cover hover:scale-110 transition transform duration-200'
                        />
                    </PhotoView>
                </div>
                <div className='p-2 text-base bg-muted'>
                    <p>{profile?.name}</p>
                    <p>{profile?.designation}</p>
                </div>
                <div className='p-2 bg-muted/20'>
                    <p className='flex space-x-2'><MdLocationOn className='mt-1 text-lg' /> <span>{profile?.address}</span></p>
                    <p className='flex space-x-2'><MdPhone className='mt-1 text-lg' /> <span>{profile?.contact}</span></p>
                    <p className='flex space-x-2'><MdWork className='mt-1 text-lg' /> <span>{profile?.profession}</span></p>
                </div>
            </div>
        </PhotoProvider>
    )
}
