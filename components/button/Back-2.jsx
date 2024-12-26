'use client';

import { GoChevronLeft } from 'react-icons/go';
import { useRouter } from 'next/navigation';

export default function Back2() {
    const route = useRouter();
    return (
        <button
            onClick={() => route?.back()}
            className="flex items-center space-x-1"
        >
            <GoChevronLeft className="h-4 w-4" />
            <span>Back</span>
        </button>
    );
}
