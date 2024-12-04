import dynamic from 'next/dynamic';

const MarqueeNotice = dynamic(() => import('@/components/module/MarqueeNotice'), { ssr: true });
const Navigation = dynamic(() => import('@/components/module/Navigation'), { ssr: true });
const Footer = dynamic(() => import('@/components/section/footer/Footer'), { ssr: true });

import 'suneditor/dist/css/suneditor.min.css'; // SunEditor default CSS
import '@/components/admin/sun-editor/suneditor-custom.css';        // Custom SunEditor styles

export default function Layout({ children }) {
    return (
        <div className='font-bengali'>
            <MarqueeNotice/>
            <Navigation/>
            <div className="w-full h-full">{children}</div>
            <Footer/>
        </div>
    );
}
