"use client"

import { NoticiasAdminView } from "@/components/dashboard/noticias/noticias-admin-view"
import { motion } from "framer-motion"

export default function NoticiasAdminPage() {
    return (
        <div className="flex-1 p-4">
            <div className="w-full space-y-4">
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-12 xl:grid-cols-12">
                    {/* Main Content */}
                    <div className="space-y-6 col-span-1 sm:col-span-2 md:col-span-4 lg:col-span-12 xl:col-span-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <NoticiasAdminView />
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}
