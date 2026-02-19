"use client"

import * as React from "react"
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getFilteredRowModel,
    ColumnFiltersState,
    SortingState,
    getSortedRowModel,
} from "@tanstack/react-table"

import { cn } from "@/lib/utils"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    noResultsMessage?: string
    containerClassName?: string
    headerClassName?: string
    tableHeight?: string
    rowSelection?: any
    onRowSelectionChange?: any
    enableRowSelection?: (row: any) => boolean
    onEndReached?: () => void
}

export function DataTable<TData, TValue>({
    columns,
    data,
    noResultsMessage = "No se encontraron resultados.",
    containerClassName,
    headerClassName = "bg-white dark:bg-teal-950",
    tableHeight = "h-[38.75rem]",
    rowSelection = {},
    onRowSelectionChange,
    enableRowSelection,
    onEndReached,
}: DataTableProps<TData, TValue>) {
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [sorting, setSorting] = React.useState<SortingState>([])
    const endOfTableRef = React.useRef<HTMLDivElement>(null)

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onRowSelectionChange: onRowSelectionChange,
        enableRowSelection: enableRowSelection,
        state: {
            columnFilters,
            sorting,
            rowSelection,
        },
    })

    React.useEffect(() => {
        if (!onEndReached) return

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    onEndReached()
                }
            },
            { threshold: 0.1, rootMargin: "100px" }
        )

        const currentRef = endOfTableRef.current
        if (currentRef) {
            observer.observe(currentRef)
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef)
            }
        }
    }, [onEndReached])

    return (
        <div className={cn("rounded-md border", containerClassName)}>
            <div className={cn("relative w-full overflow-auto", tableHeight)}>
                <table className="w-full caption-bottom text-xs border-collapse">
                    <TableHeader className={headerClassName}>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="border-none">
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            className={cn(
                                                "sticky top-0 z-20 shadow-[0_1px_0_0_rgba(0,0,0,0.1)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.1)]",
                                                headerClassName
                                            )}
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            <>
                                {table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                                {/* Indicator for end of table to trigger more loading */}
                                <tr>
                                    <td colSpan={columns.length} className="p-0">
                                        <div ref={endOfTableRef} className="h-4 w-full" />
                                    </td>
                                </tr>
                            </>
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    {noResultsMessage}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </table>
            </div>
        </div>
    )
}
