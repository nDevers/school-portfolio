import NavDesktop from './NavDesktop';
import NavMobile from './NavMobile';
import { ModeToggle } from '@/components/theme/ModeToggle';

export default function Navigation() {
    return (
        <nav className="sticky top-0 shadow p-2 z-30 space-y-2 bg-background">
            <div className="flex items-center justify-between">
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-primary">
                    LOGO
                </div>
                <div>
                    <div className="flex items-end justify-end space-x-2">
                        <ModeToggle />
                        <NavMobile />
                        <NavDesktop />
                    </div>
                </div>
            </div>
        </nav>
    );
}
