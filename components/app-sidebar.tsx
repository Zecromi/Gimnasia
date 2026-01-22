"use client"

import * as React from "react"
import {
    ShieldHalf,
    Handshake,
    Home,
    Calendar,
    Ticket,
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
        title: "Inicio",
        url: "/dashboard",
        icon: Home,
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
    {
        title: "Inscripciones de eventos",
        url: "/dashboard/inscripciones/eventos",
        icon: Ticket,
    },

]

import { useAuthStore } from "@/lib/store/auth-store"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { authData } = useAuthStore()

    const [isMounted, setIsMounted] = React.useState(false)

    React.useEffect(() => {
        setIsMounted(true)
    }, [])

    const filteredItems = items.filter(item => {
        console.log(authData)
        if (item.title === "Eventos") {
            // During SSR and hydration, emulate the server state (authData is undefined/null)
            if (!isMounted) return false
            return authData?.tipo_registro === 1
        }
        return true
    })

    return (
        <Sidebar collapsible="icon" {...props}>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Gimnasia</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {filteredItems.map((item) => (
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
