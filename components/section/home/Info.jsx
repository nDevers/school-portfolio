import { Card, CardContent, CardHeader } from '@/components/ui/card';
import React from 'react';
import { PiCertificateDuotone, PiChalkboardTeacherDuotone, PiStudentDuotone } from 'react-icons/pi';

export default function Info() {
    return (
        <section className="sp">
            <div className="max-w-7xl mx-auto py-10">
                <h2 className="text-center text-2xl font-semibold md:text-3xl mb-8">
                    গুরুত্বপূর্ণ তথ্য
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {/* Student Info Card */}
                    <Card>
                        <CardHeader className="text-lg md:text-xl font-bold font-bengali border-b p-4 px-8">
                            ছাত্রছাত্রীদের তথ্য
                        </CardHeader>
                        <CardContent className="flex space-x-3">
                            <PiStudentDuotone
                                className="text-primary text-9xl"
                                aria-label="ছাত্রছাত্রী আইকন"
                            />
                            <ul className="space-y-2 font-bengali pt-5">
                                <li>ভর্তি তথ্য</li>
                                <li>নোটিশ</li>
                                <li>রুটিন</li>
                                <li>কৃতি শিক্ষার্থী</li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Teacher Info Card */}
                    <Card>
                        <CardHeader className="text-lg md:text-xl font-bold font-bengali border-b p-4 px-8">
                            শিক্ষকদের তথ্য
                        </CardHeader>
                        <CardContent className="flex space-x-3">
                            <PiChalkboardTeacherDuotone
                                className="text-primary text-9xl"
                                aria-label="শিক্ষক আইকন"
                            />
                            <ul className="space-y-2 font-bengali pt-5">
                                <li>শিক্ষকবৃন্দ</li>
                                <li>শূণ্যপদের তালিকা</li>
                                <li>প্রাক্তন প্রধান শিক্ষক</li>
                                <li>পরিচালনা পরিষদ</li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Academic Info Card */}
                    <Card>
                        <CardHeader className="text-lg md:text-xl font-bold font-bengali border-b p-4 px-8">
                            একাডেমীক তথ্য
                        </CardHeader>
                        <CardContent className="flex space-x-3">
                            <PiCertificateDuotone
                                className="text-primary text-9xl"
                                aria-label="একাডেমীক আইকন"
                            />
                            <ul className="space-y-2 font-bengali pt-5">
                                <li>ছুটির তালিকা</li>
                                <li>যানবাহন সুবিধা</li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}
