"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ViewClubGral } from "@/lib/club-service";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const defaultCenter = {
  lat: 23.6345, // Default Center (Mexico)
  lng: -102.5528
};

function MapUpdater({ center }: { center: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 15);
    }
  }, [center, map]);
  return null;
}

interface ClubLocationDialogProps {
  club: ViewClubGral;
}

export function ClubLocationDialog({ club }: ClubLocationDialogProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [customIcon, setCustomIcon] = useState<any>(null);

  useEffect(() => {
    if (open) {
      setMounted(true);
      // Wait for mount and dynamically import leaflet components to avoid SRR issues
      import("leaflet").then((L) => {
        const iconHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-teal-600 drop-shadow-md" style="fill: currentColor; color: #0d9488;"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3" fill="#fff"/></svg>`;
        const customMarkerIcon = L.divIcon({
          html: iconHTML,
          className: "custom-map-icon bg-transparent border-0",
          iconSize: [36, 36],
          iconAnchor: [18, 36],
        });
        setCustomIcon(customMarkerIcon);

        if (L.Icon && L.Icon.Default && L.Icon.Default.prototype) {
          delete (L.Icon.Default.prototype as any)._getIconUrl;
          L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
            iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
            shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
          });
        }
      });
    }
  }, [open]);

  // Handle strings if coordinates somehow come as strings from DB
  const lat = parseFloat(club.latitud as unknown as string) || defaultCenter.lat;
  const lng = parseFloat(club.longitud as unknown as string) || defaultCenter.lng;
  const hasCoordinates = !!club.latitud && !!club.longitud && (lat !== 0 || lng !== 0);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="flex-shrink-0 h-8 w-8 text-gray-400 hover:text-[#008f80] dark:hover:text-teal-400 rounded-full hover:bg-teal-50 dark:hover:bg-teal-500/10 transition-colors"
          title="Ver ubicación"
          onClick={(e) => e.stopPropagation()}
        >
          <MapPin className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader className="px-6 py-4 border-b bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-5 w-5 text-[#3dd8c5]" />
            Ubicación: <span className="text-gray-600 dark:text-gray-300 ml-1">{club.Club}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="w-full h-[500px] bg-muted/10 relative">
          {!hasCoordinates ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 dark:bg-zinc-900/50">
              <div className="h-16 w-16 mb-4 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
                <MapPin className="h-8 w-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Ubicación Desconocida</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 max-w-sm text-center">
                Este club aún no tiene una ubicación configurada.
              </p>
              <Button variant="outline" className="mt-6" onClick={() => setOpen(false)}>
                Cerrar ventana
              </Button>
            </div>
          ) : mounted ? (
            <MapContainer
              center={[lat, lng]}
              zoom={15}
              scrollWheelZoom={true}
              style={{ height: '100%', width: '100%', zIndex: 0 }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[lat, lng]} {...(customIcon ? { icon: customIcon } : {})}>
                <Popup>
                  <div className="text-center p-1">
                    <h3 className="font-bold text-[#00A389]">{club.Club}</h3>
                    {club.Alias && <p className="text-xs text-gray-500">{club.Alias}</p>}
                  </div>
                </Popup>
              </Marker>
              <MapUpdater center={[lat, lng]} />
            </MapContainer>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-zinc-900/50">
              <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
