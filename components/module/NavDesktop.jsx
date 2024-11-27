"use client"

import * as React from "react"
import Link from "next/link"
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSub, MenubarSubContent, MenubarSubTrigger, MenubarTrigger} from "@/components/ui/menubar"
import { getNavigationData } from "@/data/navigationData"

export default function NavDesktop() {
    const navigationItems =  getNavigationData()
    return (
        <div className="hidden md:block">
            <Menubar>
                {navigationItems.map((item) => (
                    <MenubarMenu key={item.title}>
                        {item.subItems ? (
                            <MenubarTrigger>{item.title}</MenubarTrigger>
                        ) : (
                            // Wrap top-level item with no subItems in a Link
                            <Link href={item.href} passHref>
                                <MenubarTrigger>{item.title}</MenubarTrigger>
                            </Link>
                        )}
                        {item.subItems && (
                            <MenubarContent>
                                {item.subItems.map((subItem) => {
                                    return subItem?.subItems ? (
                                        <MenubarSub key={subItem.title}>
                                            <MenubarSubTrigger>{subItem.title}</MenubarSubTrigger>
                                            <MenubarSubContent>
                                                {subItem.subItems.map((nestedSubItem) => (
                                                    <MenubarItem key={nestedSubItem.title} asChild>
                                                        <Link href={nestedSubItem.href}>
                                                            {nestedSubItem.title}
                                                        </Link>
                                                    </MenubarItem>
                                                ))}
                                            </MenubarSubContent>
                                        </MenubarSub>
                                    ) : (
                                        <MenubarItem key={subItem.title} asChild>
                                            <Link href={subItem.href}>
                                                {subItem.title}
                                            </Link>
                                        </MenubarItem>
                                    )
                                })}
                            </MenubarContent>
                        )}
                    </MenubarMenu>
                ))}
            </Menubar>
        </div>
    )
}