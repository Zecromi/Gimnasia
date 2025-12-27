"use client"

import * as React from "react"
import {
    ShieldHalf,
    BadgeInfo,
    Handshake,
    Settings,
    Search,
    Calendar,
} from "lucide-react"

import { ModeToggle } from "@/components/mode-toggle"
import { UserNav } from "@/components/dashboard/user-nav"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"

// Menu items.
const items = [
    {
        title: "Mi informacion",
        url: "/dashboard",
        icon: BadgeInfo,
    },
    {
        title: "Clubes",
        url: "/dashboard/clubes",
        icon: ShieldHalf,
    },
    {
        title: "Afiliados",
        url: "/dashboard/afiliados",
        icon: Handshake,
    },
    {
        title: "Eventos",
        url: "/dashboard/eventos",
        icon: Calendar,
    },

]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Gimnasia</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild tooltip={item.title}>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <ModeToggle />
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <UserNav />
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
