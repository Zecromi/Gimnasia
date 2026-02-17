import { create } from 'zustand'
import { InscripcionReportItem, InscripcionesReportParams } from '@/lib/evento-service'

interface InscripcionesStore {
    // State
    allData: InscripcionReportItem[]
    filteredData: InscripcionReportItem[]
    filters: InscripcionesReportParams
    suggestions: { [key: string]: string[] }
    showSuggestions: { [key: string]: boolean }
    isFiltering: boolean
    hasSelectedEvent: boolean

    // Actions
    setAllData: (data: InscripcionReportItem[]) => void
    setFilters: (filters: Partial<InscripcionesReportParams> | ((prev: InscripcionesReportParams) => Partial<InscripcionesReportParams>)) => void
    filterData: () => void
    setSuggestions: (suggestions: { [key: string]: string[] }) => void
    setShowSuggestions: (show: { [key: string]: boolean } | ((prev: { [key: string]: boolean }) => { [key: string]: boolean })) => void
    setIsFiltering: (isFiltering: boolean) => void
    setHasSelectedEvent: (hasSelected: boolean) => void
    reset: () => void
}

const initialFilters: InscripcionesReportParams = {
    id_evento: "",
    nombre_event: "",
    club: "",
    id_afiliado: "",
    nom_afiliado: "",
    status: ""
}

export const useInscripcionesStore = create<InscripcionesStore>((set, get) => ({
    // Initial State
    allData: [],
    filteredData: [],
    filters: initialFilters,
    suggestions: {},
    showSuggestions: {},
    isFiltering: false,
    hasSelectedEvent: false,

    // Actions
    setAllData: (data) => set({ allData: data, filteredData: data }), // Initialize filteredData with allData

    setFilters: (filters) => set((state) => {
        const newFilters = typeof filters === 'function' ? filters(state.filters) : filters
        return { filters: { ...state.filters, ...newFilters } }
    }),

    filterData: () => {
        const { allData, filters, hasSelectedEvent } = get()
        if (allData.length === 0) return

        let filtered = [...allData]
        const newSuggestions: { [key: string]: string[] } = {}

        // Filter logic
        if (filters.id_evento) {
            const term = filters.id_evento.toLowerCase()
            filtered = filtered.filter(item => item.id_evento?.toString().toLowerCase().includes(term))
        }
        if (filters.nombre_event && hasSelectedEvent) {
            const term = filters.nombre_event.toLowerCase()
            filtered = filtered.filter(item => item.evento?.toLowerCase().includes(term))
        }
        if (filters.club) {
            const term = filters.club.toLowerCase()
            filtered = filtered.filter(item => item.club?.toLowerCase().includes(term))
        }
        if (filters.id_afiliado) {
            const term = filters.id_afiliado.toLowerCase()
            filtered = filtered.filter(item => item.id_afiliado?.toString().toLowerCase().includes(term))
        }
        if (filters.nom_afiliado) {
            const term = filters.nom_afiliado.toLowerCase()
            filtered = filtered.filter(item => item.afiliado?.toLowerCase().includes(term))
        }
        if (filters.status && filters.status !== "todos") {
            filtered = filtered.filter(item => item.Status === filters.status)
        }

        // Suggestion generation
        const generateSuggestions = (key: keyof InscripcionesReportParams, field: keyof InscripcionReportItem) => {
            const query = filters[key]
            if (query && query.length > 0) {
                const uniqueValues = Array.from(new Set(allData.map(item => String(item[field]))))
                    .filter(val => val.toLowerCase().includes(query.toLowerCase()))
                    .slice(0, 5) // Limit to 5 suggestions
                newSuggestions[key] = uniqueValues
            }
        }

        generateSuggestions("id_evento", "id_evento")
        generateSuggestions("nombre_event", "evento")
        generateSuggestions("club", "club")
        generateSuggestions("id_afiliado", "id_afiliado")
        generateSuggestions("nom_afiliado", "afiliado")

        set({ filteredData: filtered, suggestions: newSuggestions, isFiltering: false })
    },

    setSuggestions: (suggestions) => set({ suggestions }),

    setShowSuggestions: (show) => set((state) => {
        const newShow = typeof show === 'function' ? show(state.showSuggestions) : show
        return { showSuggestions: { ...state.showSuggestions, ...newShow } }
    }),

    setIsFiltering: (isFiltering) => set({ isFiltering }),

    setHasSelectedEvent: (hasSelected) => set({ hasSelectedEvent: hasSelected }),

    reset: () => set({
        allData: [],
        filteredData: [],
        filters: initialFilters,
        suggestions: {},
        showSuggestions: {},
        isFiltering: false,
        hasSelectedEvent: false
    })
}))
