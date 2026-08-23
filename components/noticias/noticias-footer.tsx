"use client";

import React, { Suspense } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import dynamic from "next/dynamic";

const PrivacyNotice = dynamic(() => import("./privacy-notice").then(mod => mod.PrivacyNotice), {
    ssr: false,
});

export function NoticiasFooter() {
    return (
        <footer className="mt-20 pb-10 border-t bg-gray-100 dark:bg-zinc-900 pt-16">
            <div className="container px-4 mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 text-center lg:text-left">
                {/* About column */}
                <div className="space-y-6 flex flex-col items-center lg:items-start">
                    <h4 className="flex flex-col text-2xl font-black italic tracking-tighter text-primary">
                        GUEM
                        <span className="text-sm font-medium not-italic text-foreground mt-1">Gimnasios Unidos del Estado de México</span>
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                        Asociación comprometida con la excelencia y el desarrollo de nuestros atletas en el ámbito gimnástico.
                    </p>
                    <div className="flex gap-4">
                        <a
                            href="https://www.instagram.com/guem.edomex?igsh=cXI1MXRyM2Y4MGNo&utm_source=qr"
                            target="_blank"
                            rel="noreferrer"
                            title="Instagram"
                            className="p-2 bg-background rounded-full hover:text-primary transition-colors shadow-sm border border-muted"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 32 32"
                                fill="currentColor"
                                className="h-4 w-4"
                                aria-hidden="true"
                            >
                                <path d="M10.202,2.098c-1.49,.07-2.507,.308-3.396,.657-.92,.359-1.7,.84-2.477,1.619-.776,.779-1.254,1.56-1.61,2.481-.345,.891-.578,1.909-.644,3.4-.066,1.49-.08,1.97-.073,5.771s.024,4.278,.096,5.772c.071,1.489,.308,2.506,.657,3.396,.359,.92,.84,1.7,1.619,2.477,.779,.776,1.559,1.253,2.483,1.61,.89,.344,1.909,.579,3.399,.644,1.49,.065,1.97,.08,5.771,.073,3.801-.007,4.279-.024,5.773-.095s2.505-.309,3.395-.657c.92-.36,1.701-.84,2.477-1.62s1.254-1.561,1.609-2.483c.345-.89,.579-1.909,.644-3.398,.065-1.494,.081-1.971,.073-5.773s-.024-4.278-.095-5.771-.308-2.507-.657-3.397c-.36-.92-.84-1.7-1.619-2.477s-1.561-1.254-2.483-1.609c-.891-.345-1.909-.58-3.399-.644s-1.97-.081-5.772-.074-4.278,.024-5.771,.096m.164,25.309c-1.365-.059-2.106-.286-2.6-.476-.654-.252-1.12-.557-1.612-1.044s-.795-.955-1.05-1.608c-.192-.494-.423-1.234-.487-2.599-.069-1.475-.084-1.918-.092-5.656s.006-4.18,.071-5.656c.058-1.364,.286-2.106,.476-2.6,.252-.655,.556-1.12,1.044-1.612s.955-.795,1.608-1.05c.493-.193,1.234-.422,2.598-.487,1.476-.07,1.919-.084,5.656-.092,3.737-.008,4.181,.006,5.658,.071,1.364,.059,2.106,.285,2.599,.476,.654,.252,1.12,.555,1.612,1.044s.795,.954,1.051,1.609c.193,.492,.422,1.232,.486,2.597,.07,1.476,.086,1.919,.093,5.656,.007,3.737-.006,4.181-.071,5.656-.06,1.365-.286,2.106-.476,2.601-.252,.654-.556,1.12-1.045,1.612s-.955,.795-1.608,1.05c-.493,.192-1.234,.422-2.597,.487-1.476,.069-1.919,.084-5.657,.092s-4.18-.007-5.656-.071M21.779,8.517c.002,.928,.755,1.679,1.683,1.677s1.679-.755,1.677-1.683c-.002-.928-.755-1.679-1.683-1.677,0,0,0,0,0,0-.928,.002-1.678,.755-1.677,1.683m-12.967,7.496c.008,3.97,3.232,7.182,7.202,7.174s7.183-3.232,7.176-7.202c-.008-3.97-3.233-7.183-7.203-7.175s-7.182,3.233-7.174,7.203m2.522-.005c-.005-2.577,2.08-4.671,4.658-4.676,2.577-.005,4.671,2.08,4.676,4.658,.005,2.577-2.08,4.671-4.658,4.676-2.577,.005-4.671-2.079-4.676-4.656h0" />
                            </svg>
                        </a>
                    </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-6 flex flex-col items-center lg:items-start">
                    <h5 className="font-bold text-lg tracking-wider font-serif italic text-teal-600 dark:text-teal-400">Contáctanos</h5>
                    <div className="space-y-4 text-sm text-muted-foreground">
                        <div className="flex flex-col items-center lg:items-start gap-3">
                            <div className="flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-primary shrink-0" />
                                <p className="font-bold text-foreground">Dirección</p>
                            </div>
                            <div className="space-y-1 text-center lg:text-left">
                                <p>Calle 2 de Marzo, Mz 34 Lt 38. Col. Jacalones I.</p>
                                <p>San Miguel, Chalco, Estado de México. CP 56604.</p>
                                <p className="text-xs italic text-muted-foreground pt-1">Entre Calle Iztaccihuatl y Calle 5 de Mayo</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-center lg:justify-start gap-3 pt-2">
                            <Phone className="h-4 w-4 text-primary shrink-0" />
                            <a href="tel:+525568780440" className="hover:text-primary transition-colors">Teléfono: +52 55 6878 0440</a>
                        </div>
                        <div className="flex items-center justify-center lg:justify-start gap-3">
                            <Mail className="h-4 w-4 text-primary shrink-0" />
                            <a href="mailto:guemasociacion@gmail.com" className="hover:text-primary transition-colors">E-mail: guemasociacion@gmail.com</a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container px-4 mx-auto mt-16 text-center">
                <Suspense fallback={<div className="h-20" />}>
                    <PrivacyNotice />
                </Suspense>
            </div>
        </footer>
    );
}
