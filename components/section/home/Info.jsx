import { Card, CardContent, CardHeader } from '@/components/ui/card'
import Image from 'next/image'
import React from 'react'
import { PiCertificateDuotone, PiChalkboardTeacherDuotone, PiStudentDuotone, PiStudentFill } from "react-icons/pi";

export default function Info() {
    return (
        <section className='sp'>
            <div className='max-w-7xl mx-auto py-10'>
                <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                    <Card className='rounded-none'>
                        <CardHeader className='font-bengali md:text-lg'>ছাত্রছাত্রীদের তথ্য</CardHeader>
                        <CardContent className='flex'>
                            <PiStudentDuotone className='text-9xl' />
                            <ul className='p-4'>
                                <li>ভর্তি তথ্য</li>
                                <li>নোটিশ</li>
                                <li>রুটিন</li>
                                <li>কৃতি শিক্ষার্থী</li>
                            </ul>
                        </CardContent>
                    </Card>
                    <Card className='rounded-none'>
                        <CardHeader className='font-bengali md:text-lg'>শিক্ষকদের তথ্য</CardHeader>
                        <CardContent className='flex'>
                            <PiChalkboardTeacherDuotone className='text-9xl' />
                            <ul className='p-4'>
                                <li>শিক্ষকবৃন্দ</li>
                                <li>শূণ্যপদের তালিকা</li>
                                <li>প্রাক্তন প্রধান শিক্ষক</li>
                                <li>পরিচালনা পরিষদ</li>
                            </ul>
                        </CardContent>
                    </Card>
                    <Card className='rounded-none'>
                        <CardHeader className='font-bengali md:text-lg'>একাডেমীক তথ্য</CardHeader>
                        <CardContent className='flex'>
                            <PiCertificateDuotone className='text-9xl' />
                            <ul className='p-4'>
                                <li>ছুটির তালিকা</li>
                                <li>যানবাহন সুবিধা</li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}
