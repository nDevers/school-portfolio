'use client';

import { HiLocationMarker, HiPhone, HiStar } from 'react-icons/hi';
import { PhotoProvider, PhotoView } from 'react-photo-view';

export default function AcademicProfileCard({ profile }) {
    return (
        <PhotoProvider>
            <div className="border w-fit mx-auto">
                <div
                    src={profile?.image}
                    className="w-full h-60 overflow-hidden"
                >
                    <PhotoView src={profile?.image}>
                        <img
                            src={profile?.image}
                            alt="profile"
                            className="w-full h-full object-cover hover:scale-110 transition transform duration-200"
                        />
                    </PhotoView>
                </div>
                <div className="p-2 text-base bg-muted">
                    <strong>{profile?.name}</strong>
                    <p>{profile?.designation}</p>
                </div>
                <div className="p-2 space-y-1 bg-muted/20">
                    <p className="flex space-x-2">
                        <HiStar className="mt-0.5 text-lg text-foreground/30" />{' '}
                        <span>{profile?.profession}</span>
                    </p>
                    <p className="flex space-x-2">
                        <HiLocationMarker className="mt-0.5 text-lg text-foreground/30" />{' '}
                        <span>{profile?.address}</span>
                    </p>
                    <p className="flex space-x-2">
                        <HiPhone className="mt-0.5 text-lg text-foreground/30" />{' '}
                        <span>{profile?.contact}</span>
                    </p>
                </div>
            </div>
        </PhotoProvider>
    );
}
