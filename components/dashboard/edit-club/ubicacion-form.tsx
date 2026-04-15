"use client"

import * as React from "react"
import { MapPin, Search, Save } from "lucide-react"
import { useFormContext } from "react-hook-form"
import { MapContainer, TileLayer, Marker, useMapEvents, useMap, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { toast } from "sonner"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

import { ViewClubGral, postClubLocation } from "@/lib/club-service"
import { CopyButton } from "./copy-button"

const defaultCenter = {
    lat: 23.6345, // Default Center (Mexico)
    lng: -102.5528
};

function MapUpdater({ center }: { center: [number, number] | null }) {
    const map = useMap();
    React.useEffect(() => {
        if (center) {
            map.flyTo(center, 15);
        }
    }, [center, map]);
    return null;
}

function LocationMarker({ currentLat, currentLng, setLocation, icon, currentAddress }: { currentLat: number, currentLng: number, setLocation: (lat: number, lng: number) => void, icon?: any, currentAddress?: string }) {
    useMapEvents({
        click(e: any) {
            setLocation(e.latlng.lat, e.latlng.lng);
        },
    });

    return currentLat !== 0 ? (
        <Marker position={[currentLat, currentLng]} {...(icon ? { icon } : {})}>
            {currentAddress && (
                <Popup>
                    {currentAddress}
                </Popup>
            )}
        </Marker>
    ) : null;
}

export function UbicacionForm({ club }: { club: ViewClubGral }) {
    const { setValue, watch, getValues } = useFormContext();
    const latitudStr = watch("latitud");
    const longitudStr = watch("longitud");
    const [mounted, setMounted] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState("");
    const [isSearching, setIsSearching] = React.useState(false);
    const [mapCenter, setMapCenter] = React.useState<[number, number] | null>(null);
    const [customIcon, setCustomIcon] = React.useState<any>(null);

    React.useEffect(() => {
        setMounted(true);
        // Fix Leaflet icons
        import("leaflet").then((L) => {
            const iconHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-teal-600 drop-shadow-md" style="fill: currentColor; color: #0d9488;"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3" fill="#fff"/></svg>`;
            const customMarkerIcon = L.divIcon({
                html: iconHTML,
                className: "custom-map-icon bg-transparent border-0",
                iconSize: [36, 36],
                iconAnchor: [18, 36],
            });
            setCustomIcon(customMarkerIcon);

            delete (L.Icon.Default.prototype as any)._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            });
        });
    }, []);

    const currentLat = parseFloat(latitudStr) || defaultCenter.lat;
    const currentLng = parseFloat(longitudStr) || defaultCenter.lng;
    const [currentAddress, setCurrentAddress] = React.useState<string>("");

    React.useEffect(() => {
        if (currentLat !== 0 && currentLat !== defaultCenter.lat) {
            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${currentLat}&lon=${currentLng}`)
                .then(res => res.json())
                .then(data => {
                    if (data && data.display_name) {
                        setCurrentAddress(data.display_name);
                    }
                })
                .catch(err => console.error("Error fetching address:", err));
        } else {
            setCurrentAddress("");
        }
    }, [currentLat, currentLng]);

    const setLocation = (lat: number, lng: number) => {
        setValue("latitud", lat.toString(), { shouldDirty: true });
        setValue("longitud", lng.toString(), { shouldDirty: true });
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        setIsSearching(true);
        try {
            // Limpiar abreviaturas comunes y preparar variaciones (fallbacks) para Google Maps strings
            let cleanQuery = searchQuery
                .replace(/Méx\./gi, "Estado de México")
                .replace(/Edo\.? de Méx\./gi, "Estado de México")
                .replace(/Edo\./gi, "Estado de")
                .replace(/CDMX/gi, "Ciudad de México");

            const parts = cleanQuery.split(',').map(p => p.trim());
            let queriesToTry = [cleanQuery];

            if (parts.length > 1) {
                // 1. Quitar la primera parte (frecuentemente calle específica y número)
                queriesToTry.push(parts.slice(1).join(', '));

                // 2. Tomar las últimas 2 partes (usualmente Municipio, Estado), quitando el CP
                const lastTwo = parts.slice(-2).join(', ')
                    .replace(/\\b\\d{4,5}\\b/g, '') // Quita el CP
                    .replace(/  +/g, ' ')        // Evita dobles espacios
                    .trim();

                // Limpiar posibles comas huerfanas al inicio
                const cleanLastTwo = lastTwo.replace(/^,\\s*/, '');
                if (cleanLastTwo) queriesToTry.push(cleanLastTwo);
            }

            // Quitar duplicados por si acaso quedaron iguales
            queriesToTry = [...new Set(queriesToTry)].filter(q => q.length > 0);

            let data = null;
            for (const query of queriesToTry) {
                const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`, {
                    headers: { 'Accept-Language': 'es' }
                });
                const result = await response.json();
                if (result && result.length > 0) {
                    data = result;
                    break;
                }
            }

            if (data && data.length > 0) {
                const lat = parseFloat(data[0].lat);
                const lon = parseFloat(data[0].lon);
                setMapCenter([lat, lon]);
                setLocation(lat, lon);
            } else {
                toast.error("Ubicación no encontrada. Intenta buscar solo por municipio o estado.");
            }
        } catch (error) {
            console.error("Error buscando ubicación:", error);
            toast.error("Error al buscar ubicación");
        } finally {
            setIsSearching(false);
        }
    };

    const handleSaveLocation = async () => {
        const vals = getValues();
        if (!club?.id) {
            toast.error("Error: ID del club no encontrado.");
            return;
        }

        try {

            await postClubLocation({
                id: club.id.toString(),
                latitud: vals.latitud,
                longitud: vals.longitud,
            });
            toast.success("Ubicación actualizada correctamente.");
        } catch (error) {
            console.error("Error al guardar ubicación:", error);
            toast.error("Error al actualizar la ubicación.");
        }
    }

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold bg-muted py-2 px-4 rounded-md flex items-center mb-6">
                <MapPin className="mr-2 h-5 w-5" />
                Ubicación del Club
            </h3>
            <div className="flex flex-col gap-6 p-4 border rounded-xl bg-muted/10">
                <div className="text-sm text-muted-foreground mb-[-1rem]">
                    Busca una dirección o haz clic en el mapa para ubicar el marcador del club.
                </div>

                <div className="flex gap-2">
                    <Input
                        placeholder="Buscar dirección, ciudad o lugar..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearch())}
                    />
                    <Button type="button" variant="secondary" onClick={handleSearch} disabled={isSearching}>
                        <Search className="h-4 w-4 mr-2" />
                        {isSearching ? "Buscando..." : "Buscar"}
                    </Button>
                </div>

                <div className="w-full h-[400px] rounded-lg overflow-hidden border">
                    {mounted ? (
                        <MapContainer
                            center={[currentLat !== 0 ? currentLat : defaultCenter.lat, currentLng !== 0 ? currentLng : defaultCenter.lng]}
                            zoom={currentLat !== 0 && currentLat !== defaultCenter.lat ? 15 : 5}
                            scrollWheelZoom={true}
                            style={{ height: '100%', width: '100%' }}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <LocationMarker currentLat={currentLat} currentLng={currentLng} setLocation={setLocation} icon={customIcon} currentAddress={currentAddress} />
                            <MapUpdater center={mapCenter} />
                        </MapContainer>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted animate-pulse">
                            Cargando mapa...
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <Label>Coordenadas para Google Maps (Copiar y pegar)</Label>
                    <div className="flex gap-2">
                        <Input readOnly value={`${latitudStr || "0"}, ${longitudStr || "0"}`} className="bg-muted font-mono" />
                        <CopyButton value={`${latitudStr || "0"}, ${longitudStr || "0"}`} />
                        <Button type="button" variant="outline" className="hidden sm:flex" asChild>
                            <a href={`https://www.google.com/maps/search/?api=1&query=${latitudStr || "0"},${longitudStr || "0"}`} target="_blank" rel="noopener noreferrer">
                                Abrir Google Maps
                            </a>
                        </Button>
                        <Button type="button" variant="outline" size="icon" className="sm:hidden flex-shrink-0" asChild>
                            <a href={`https://www.google.com/maps/search/?api=1&query=${latitudStr || "0"},${longitudStr || "0"}`} target="_blank" rel="noopener noreferrer">
                                <MapPin className="h-4 w-4" />
                            </a>
                        </Button>
                    </div>
                </div>

                <div className="flex justify-start">
                    <Button type="button" onClick={handleSaveLocation} className="mt-4 bg-teal-600 hover:bg-teal-700 text-white">
                        <Save className="mr-2 h-4 w-4" />
                        Guardar Ubicación
                    </Button>
                </div>
            </div>
        </div>
    )
}
