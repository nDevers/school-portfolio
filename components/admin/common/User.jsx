'use client';
import { useUser } from '@/contexts/UserContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronUp, User2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logout } from "@/util/auth";

export default function User() {
    const { user } = useUser();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size='icon'> <User2 className="w-4 h-4" /> </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" className="mr-4 w-[--radix-popper-anchor-width]">
                <DropdownMenuLabel className='capitalize'> {user ? user.userType : 'No user found'}</DropdownMenuLabel>
                <DropdownMenuItem> Account </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}> Sign out </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
