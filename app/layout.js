import Wrapper from '@/providers/Wrapper';
import appConfig from '@/configs/appConfig';
import { Toaster } from '@/components/ui/sonner';
import { Inter, Satisfy } from 'next/font/google';
import { Noto_Sans_Bengali, Noto_Serif_Bengali } from 'next/font/google'; // Import the Bangla font

import './globals.css';
import 'react-photo-view/dist/react-photo-view.css';

const inter = Inter({ subsets: ['latin'] });

const sansBengali = Noto_Sans_Bengali({
    weight: '400', // or specify other weights you need
    subsets: ['bengali'], // Make sure to use 'bengali' subset
    variable: '--font-noto-sans-bengali',
});

const serifBengali = Noto_Serif_Bengali({
    weight: '400', // or specify other weights you need
    subsets: ['bengali'], // Make sure to use 'bengali' subset
    variable: '--font-noto-serif-bengali',
});

const satisfy = Satisfy({
    weight: '400', // or specify other weights you need
    subsets: ['latin'], // Make sure to use 'bengali' subset
    variable: '--font-satisfy',
});

export const metadata = {
    title: appConfig?.Title,
    description: appConfig?.Description,
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body
                className={`${inter.variable} ${sansBengali.variable} ${serifBengali.variable} ${satisfy.variable} text-sm antialiased`}
            >
                <Wrapper>{children}</Wrapper>
            </body>
            <Toaster richColors position="top-center" />
        </html>
    );
}
