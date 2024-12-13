'use client'
import { Calendar, Home, Inbox, Settings, File, Info, CircleUserRound, ImagePlay, ChevronDown, UsersRound, Settings2, Tag, FileText, School, CircleDollarSign, Wallet, Dot } from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubItem } from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export const FacultyCategories = [
  {
    title: 'Teacher',
    category: 'teacher',
    url: '/admin/faculty/teacher'
  },
  {
    title: 'Board',
    category: 'board',
    url: '/admin/faculty/board'
  },
  {
    title: 'Ex Head Teacher',
    category: 'ex_head_teacher',
    url: '/admin/faculty/ex_head_teacher'
  },
  {
    title: 'Merit Student',
    category: 'merit_student',
    url: '/admin/faculty/merit_student'
  },
]

export const AcademicCategories = [
  {
    title: 'Routine',
    category: 'routine',
    url: '/admin/academic/routine'
  },
  {
    title: 'Result',
    category: 'result',
    url: '/admin/academic/result'
  },
  {
    title: 'Admission Form',
    category: 'admission_form',
    url: '/admin/academic/admission_form'
  },
];

// Sidebar data structure
const initialSidebarData = [
  {
    label: "School",
    items: [
      { title: "Dashboard", url: "/admin", icon: Home },
      { title: "Configuration", url: "/admin/configuration", icon: Settings },
      {
        title: "About School",
        icon: Info,
        subItems: [
          { title: "Info", url: "/admin/about/info" },
          { title: "Speech", url: "/admin/about/speech" },
          { title: "Carousel", url: "/admin/about/carousel" },
          { title: "Achievement", url: "/admin/about/achievement" },
          { title: "More About Us", url: "/admin/about/more-about-us" },
          { title: "FAQ", url: "/admin/about/faq" },
        ],
      },
    ],
  },
  {
    label: "Faculty",
    items: [
      {
        title: "Faculty",
        icon: Info,
        subItems: FacultyCategories,
      },
      {
        title: "Academic",
        icon: Info,
        subItems: AcademicCategories,
      },
      { title: "Career", icon: CircleUserRound, url: "/admin/career" },
    ],
  },
  {
    label: "Media Center",
    items: [
      { title: "blog", icon: CircleUserRound, url: "/admin/blog" },
      {
        title: "Gallery", icon: ImagePlay,
        subItems: [
          { title: "Photos", url: "/admin/media/photos" },
          { title: "Videos", url: "/admin/media/videos" },
        ],
      },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const isActive = (url) => {
    if (url === "/admin") return pathname === url; // Exact match for `/admin`
    return pathname.startsWith(url); // Default behavior for other routes
  };
  const isParentActive = (subItems) => subItems.some((subItem) => isActive(subItem.url));

  return (
    <Sidebar variant="floating">
      <SidebarContent className="sidebar-scroll">

        {/* Dynamic Sidebar Groups */}
        {initialSidebarData.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) =>
                  item.subItems ? (
                    <Collapsible key={item.title} className="group/collapsible">
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton className={cn(isParentActive(item.subItems) ? 'text-primary hover:text-primary' : '')} >
                            <item.icon className="mr-1" />
                            {item.title}
                            <Dot className="ml-auto" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.subItems.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title} className={cn(isActive(subItem.url) ? 'text-primary hover:text-primary' : 'text-muted-foreground')} >
                                <SidebarMenuButton asChild>
                                  <Link href={subItem.url}>{subItem.title}</Link>
                                </SidebarMenuButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  ) : (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild className={cn(isActive(item.url) ? 'text-primary hover:text-primary' : '')} >
                        <Link href={item.url}>
                          <item.icon className="mr-1" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
