import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { cookies } from "next/headers";
import { LogoutButton } from "@/components/dashboard/logout-button";

export default async function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const cookieStore = await cookies();
    const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";

    return (
        <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar />
            <main className="flex w-full flex-1 flex-col">
                <div className="flex h-16 items-center border-b px-4 justify-between">
                    <SidebarTrigger />
                    <LogoutButton />
                </div>
                {children}
            </main>
        </SidebarProvider>
    );
}
