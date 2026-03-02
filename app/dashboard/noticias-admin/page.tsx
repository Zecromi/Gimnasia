"use client"

import { NoticiasAdminView } from "@/components/dashboard/noticias/noticias-admin-view"
import { motion } from "framer-motion"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function NoticiasAdminPage() {
    return (
        <ScrollArea className="h-[calc(100vh-1rem)]">
            <div className="flex-1 p-4 pb-10">
                <div className="mx-auto max-w-[1600px] space-y-4">

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <NoticiasAdminView />
                    </motion.div>
                </div>
            </div>
        </ScrollArea>
    )
}
