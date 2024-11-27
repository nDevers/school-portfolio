import Breadcrumbs from "@/components/module/Breadcrumbs";
import SideNav from "@/components/module/SideNav";
import { getNavigationData } from "@/data/navigationData";

export default function Layout({ children }) {
  const subNav = getNavigationData(["About"])
    return (
        <div className='flex flex-col md:flex-row gap-4 sp spy w-full h-full'>
            <SideNav subNav={subNav[0]}/>
            <div className="space-y-4 w-full h-full">
                <Breadcrumbs />
                {children}
            </div>
        </div>
    );
}
