"use client"

import * as React from "react"
import { Search, Users, UserCog } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

// Mock data type
interface AdminUser {
    id: string
    nombre: string
    rol: string
    estado: string
    club?: string
}

// Mock data
const MOCK_USERS: AdminUser[] = [
    { id: "1", nombre: "Juan Pérez", rol: "Super Admin", estado: "Activo" },
    { id: "2", nombre: "María Garcia", rol: "Admin Club", estado: "Activo", club: "Club Oli" },
    { id: "3", nombre: "Carlos López", rol: "Admin Club", estado: "Inactivo", club: "Club Alpha" },
    { id: "4", nombre: "Ana Martínez", rol: "Staff", estado: "Activo" },
    { id: "5", nombre: "Roberto Sánchez", rol: "Admin Club", estado: "Activo", club: "Club Beta" },
]

export default function SuperUsuarioPage() {
    const [searchId, setSearchId] = React.useState("")
    const [searchName, setSearchName] = React.useState("")
    const [filteredUsers, setFilteredUsers] = React.useState<AdminUser[]>(MOCK_USERS)

    const handleSearch = () => {
        const lowerName = searchName.toLowerCase()
        const lowerId = searchId.toLowerCase()

        const filtered = MOCK_USERS.filter(user => {
            const matchesId = user.id.toLowerCase().includes(lowerId)
            const matchesName = user.nombre.toLowerCase().includes(lowerName)
            return matchesId && matchesName
        })
        setFilteredUsers(filtered)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch()
        }
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Personal</h2>
            </div>

            <Card className="">
                <CardHeader className="pt-4">
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Filtros
                    </CardTitle>
                </CardHeader>
                <CardContent className="">
                    <div className="flex flex-col md:flex-row gap-4 pb-4">
                        <div className="flex-1 space-y-2">
                            <label htmlFor="search-id" className="text-sm font-medium">
                                ID Personal
                            </label>
                            <Input
                                id="search-id"
                                placeholder="Buscar por ID..."
                                value={searchId}
                                onChange={(e) => setSearchId(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                        </div>
                        <div className="flex-1 space-y-2">
                            <label htmlFor="search-name" className="text-sm font-medium">
                                Nombre
                            </label>
                            <Input
                                id="search-name"
                                placeholder="Buscar por Nombre..."
                                value={searchName}
                                onChange={(e) => setSearchName(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                        </div>
                        <div className="flex items-end">
                            <Button onClick={handleSearch} className="w-full md:w-auto">
                                <Search className="mr-2 h-4 w-4" />
                                Buscar
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="py-4">
                <CardHeader>
                    <CardTitle>Listado de Personal</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Nombre</TableHead>
                                    <TableHead>Rol</TableHead>
                                    <TableHead>Club Asignado</TableHead>
                                    <TableHead>Estado</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium">{user.id}</TableCell>
                                            <TableCell>{user.nombre}</TableCell>
                                            <TableCell>{user.rol}</TableCell>
                                            <TableCell>{user.club || "-"}</TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.estado === 'Activo'
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                                    }`}>
                                                    {user.estado}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">
                                            No se encontraron resultados.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
