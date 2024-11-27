import MarqueeNotice from "@/components/module/MarqueeNotice";
import Navigation from "@/components/module/Navigation";
import Footer from "@/components/section/footer/Footer";

import 'suneditor/dist/css/suneditor.min.css'; // SunEditor default CSS
import '@/components/admin/sun-editor/suneditor-custom.css';        // Custom SunEditor styles

export default function Layout({ children }) {
    return (
        <div>
            <MarqueeNotice/>
            <Navigation/>
            <div className="w-full h-full">{children}</div>
            <Footer/>
        </div>
    );
}
