"use client";

import React, { useState, useEffect, useMemo } from "react";
import { getClubs, ViewClubGral } from "@/lib/club-service";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Mail, Globe, Users, Building2, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { downloadArchivoEventoPdf } from "@/lib/evento-service";

const ClubLocationDialog = dynamic(
  () => import("./club-location-dialog").then((mod) => mod.ClubLocationDialog),
  {
    loading: () => <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-zinc-800 animate-pulse flex-shrink-0" />,
    ssr: false
  }
);

function formatClubTitle(title?: string) {
  if (!title) return "";
  const trimmed = title.trim();
  if (trimmed.length <= 4) {
    return <span className="font-serif italic font-normal text-teal-600 dark:text-teal-400">{trimmed}</span>;
  }
  const first = trimmed.slice(0, -4);
  const last = trimmed.slice(-4);
  return (
    <>
      {first}
      <span className="font-serif italic font-normal text-teal-600 dark:text-teal-400">{last}</span>
    </>
  );
}

function ClubLogo({ clubId, clubName }: { clubId: string | number, clubName: string }) {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let objectUrl: string | null = null;
    const loadLogo = async () => {
      if (!clubId) {
        setError(true);
        return;
      }
      try {
        const response = await downloadArchivoEventoPdf(String(clubId), "2");
        if (response.data && response.data.size > 0 && response.data.type.startsWith('image/')) {
          objectUrl = URL.createObjectURL(response.data);
          setImgSrc(objectUrl);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      }
    };
    loadLogo();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [clubId]);

  if (error || !imgSrc) {
    return (
      <div className="w-20 h-20 rounded-full bg-[#f0fcf9] text-[#00A389] dark:bg-teal-500/10 dark:text-teal-400 flex items-center justify-center flex-shrink-0 shadow-sm border border-teal-50/50">
        <Building2 className="h-10 w-10" />
      </div>
    );
  }

  return (
    <div className="w-20 h-20 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center flex-shrink-0 overflow-hidden border border-gray-100 dark:border-zinc-700 shadow-md">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imgSrc}
        alt={`Logo de ${clubName}`}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
    </div>
  );
}

export function ClubesList() {
  const [clubs, setClubs] = useState<ViewClubGral[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination state
  const [visibleCount, setVisibleCount] = useState(20);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        setLoading(true);
        const data = await getClubs();
        if (data && data.View_Club_gral) {
          // Filtrar clubes que esten activos si es necesario, pero mostramos todos y los filtros
          setClubs(data.View_Club_gral);
        }
      } catch (err) {
        console.error("Error fetching clubs:", err);
        setError("Ocurrió un error al cargar los clubes. Por favor, inténtalo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  // Filter clubs based on search term
  const filteredClubs = useMemo(() => {
    if (!searchTerm.trim()) return clubs;

    const lowerSearch = searchTerm.toLowerCase();
    return clubs.filter(
      (club) =>
        (club.Club && club.Club.toLowerCase().includes(lowerSearch)) ||
        (club.Alias && club.Alias.toLowerCase().includes(lowerSearch))
    );
  }, [clubs, searchTerm]);

  // Handle Load More
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 20);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-500 dark:text-gray-400 font-medium tracking-wide">Cargando clubes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 text-center">
        <p className="text-red-500 dark:text-red-400 font-medium bg-red-50 dark:bg-red-950/20 p-4 rounded-lg inline-block">{error}</p>
      </div>
    );
  }

  const visibleClubs = filteredClubs.slice(0, visibleCount);
  const hasMore = visibleCount < filteredClubs.length;

  return (
    <div className="space-y-8 w-full max-w-7xl mx-auto px-2 md:px-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-none border border-gray-100 dark:border-zinc-800">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white font-sans leading-tight">
            Clubes <span className="font-serif italic font-normal text-teal-600 dark:text-teal-400">Afiliados</span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1.5 font-medium">
            Encuentra y conoce los clubes autorizados y registrados en la asociación.
          </p>
        </div>

        <div className="relative w-full md:w-[350px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Buscar por nombre o alias..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setVisibleCount(20); // Reset count on search
            }}
            className="pl-10 h-12 bg-gray-50 dark:bg-zinc-950 border-transparent focus-visible:ring-[#008f80]/50 rounded-xl"
          />
        </div>
      </div>

      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
        Mostrando <span className="text-gray-900 dark:text-white">{visibleClubs.length}</span> de <span className="text-gray-900 dark:text-white">{filteredClubs.length}</span> clubes
      </div>

      {filteredClubs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 border-dashed">
          <Building2 className="h-16 w-16 text-gray-300 dark:text-zinc-700 mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">No se encontraron clubes con la búsqueda actual</p>
          <Button
            variant="ghost"
            className="mt-4 text-[#008f80]"
            onClick={() => setSearchTerm("")}
          >
            Limpiar filtros
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {visibleClubs.map((club) => (
              <motion.div
                layout
                key={club.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <Card className="h-full flex flex-col hover:shadow-md transition-shadow duration-300 dark:border-zinc-800 bg-white shadow-none dark:bg-zinc-900 rounded-xl overflow-hidden relative group">
                  <div className="h-1.5 w-full bg-[#3dd8c5] absolute top-0 left-0 right-0"></div>
                  <CardHeader className="pt-8 pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <ClubLogo clubId={club.id} clubName={club.Club || "Club"} />
                      <div className="flex items-center gap-2">
                        {club.Alias && (
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase bg-gray-50 text-gray-500 dark:bg-zinc-800 dark:text-gray-400">
                            {club.Alias}
                          </span>
                        )}
                        <ClubLocationDialog club={club} />
                      </div>
                    </div>
                    <CardTitle className="text-[17px] font-bold uppercase tracking-tight text-gray-900 dark:text-white mt-0 mb-0 line-clamp-2 min-h-[0.5rem]">
                      {formatClubTitle(club.Club)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-end pt-2 pb-6">
                    <div className="space-y-4">
                      {club.Email ? (
                        <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex-shrink-0 text-gray-400 dark:text-gray-500">
                            <Mail className="h-[18px] w-[18px]" />
                          </div>
                          <a href={`mailto:${club.Email}`} className="hover:text-[#008f80] transition-colors truncate font-medium" title={club.Email}>
                            {club.Email}
                          </a>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 text-sm text-gray-300 dark:text-zinc-600 italic">
                          <div className="flex-shrink-0 text-gray-200 dark:text-zinc-700">
                            <Mail className="h-[18px] w-[18px]" />
                          </div>
                          Sin email registrado
                        </div>
                      )}

                      {club.Web ? (
                        <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex-shrink-0 text-gray-400 dark:text-gray-500">
                            <Globe className="h-[18px] w-[18px]" />
                          </div>
                          <a href={club.Web.startsWith('http') ? club.Web : `https://${club.Web}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#008f80] transition-colors truncate flex items-center gap-1 group/link font-medium" title={club.Web}>
                            {club.Web}
                          </a>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 text-sm text-gray-300 dark:text-zinc-600 italic">
                          <div className="flex-shrink-0 text-gray-200 dark:text-zinc-700">
                            <Globe className="h-[18px] w-[18px]" />
                          </div>
                          Sin sitio web
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {hasMore && (
        <div className="flex justify-center pt-6 pb-2">
          <Button
            variant="outline"
            onClick={handleLoadMore}
            className="rounded-full px-6 py-2.5 h-auto bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-zinc-800 shadow-sm transition-all group"
          >
            <span className="font-medium text-sm">Ver más clubes</span>
            <span className="ml-2.5 inline-flex items-center justify-center bg-slate-100 dark:bg-zinc-800 rounded-full h-5 px-2 text-[10px] font-bold text-slate-600 dark:text-gray-400 group-hover:bg-slate-200 dark:group-hover:bg-zinc-700 transition-colors">
              {filteredClubs.length - visibleCount} restantes
            </span>
          </Button>
        </div>
      )}
    </div>
  );
}
