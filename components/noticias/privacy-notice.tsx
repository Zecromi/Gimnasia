"use client";

import React from "react";
import { Shield } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export function PrivacyNotice() {
    return (
        <div className="container px-4 mx-auto mt-16 text-center">
            <Separator className="mb-8" />
            <div className="flex flex-col items-center gap-4">
                <p className="text-xs text-muted-foreground font-medium">
                    © {new Date().getFullYear()} GUEM Todos los derechos reservados
                </p>

                <Dialog>
                    <DialogTrigger asChild>
                        <button className="text-xs text-muted-foreground hover:text-primary transition-colors font-medium flex items-center gap-1">
                            <Shield className="h-3 w-3" />
                            Aviso de privacidad
                        </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col p-0 overflow-hidden">
                        <DialogHeader className="p-6 pb-2">
                            <DialogTitle className="text-xl font-bold flex items-center gap-2">
                                <Shield className="h-5 w-5 text-primary" />
                                Aviso de Privacidad
                            </DialogTitle>
                            <DialogDescription>
                                Federación Mexicana de Gimnasia A.C.
                            </DialogDescription>
                        </DialogHeader>
                        <ScrollArea className="h-[400px] md:h-[500px] w-full p-6 pt-2">
                            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed text-justify pr-4">
                                <p>
                                    La Federación Mexicana de Gimnasia A.C. (FMG) con domicilio en Camino a Santa Teresa 482, Mezzanine del Pabellón de Gimnasia, Tlalpan, C.P 14060 en la Ciudad de México, es responsable de recabar sus datos personales, el uso que se le dé a los mismos y de su protección.
                                </p>
                                <p>
                                    La FMG manifiesta que su información personal será tratada con absoluta confidencialidad; de acuerdo a lo previsto en la Ley Federal de Protección de Datos Personales en Posesión de particulares, en el Capítulo I, artículo 2 y Capítulo II, artículos 15, 16 y 17; para los propósitos competentes a dicha Federación como lo son el empadronamiento de Gimnastas, Entrenadores, Directivos, Jueces y otros; la organización y promoción de la Gimnasia en el país así como en el extranjero a través de competencias y eventos y la capacitación continua de sus afiliados.
                                </p>
                                <p>
                                    Los datos recabados por la FMG podrán ser de forma directa; los que se proporcionen personalmente, o indirecta; telefónicamente y a través de nuestra página de Internet o cualquier otro medio electrónico reconocido por la FMG. La información solicitada pueden ser la siguiente: nombre, domicilio, escolaridad, teléfono, correo electrónico, función, modalidad, curp, fecha de nacimiento, nacionalidad, sexo, país de nacimiento e imagen dentro o fuera de la práctica del deporte.
                                </p>
                                <p>
                                    Los datos personales que se indican, serán incorporados a las bases de datos de la Federación Mexicana de Gimnasia, A.C., para la gestión interna al Sistema de Registro del Deporte Federado y los programas propios de misma Federación.
                                </p>
                                <p>
                                    Asimismo, la FMG manifiesta que sus datos e imagen, podrán ser transferidos o tratados dentro y fuera del país, por personas distintas a esta Federación. En este sentido, su información puede ser compartida con los siguientes fines: Gestionar pruebas para control de sustancias prohibidas en la práctica del deporte. Gestionar el control médico y psicológico para ayuda del gimnasta. Gestionar ante compañías Aseguradoras, ingreso a póliza de seguro colectivo contra accidentes de la FMG, en la práctica de la gimnasia. Transmitirlos, si es necesario, a las Administraciones Públicas, en cumplimiento de la normatividad laboral, de Seguridad Social, Tributaria, Presupuestaria y Deportiva. Transmitirlos, si es necesario, a la Comisión Nacional de Cultura Física y Deporte, el Comité Olímpico Mexicano, la Confederación Deportiva Mexicana, la Federación Internacional de Gimnasia, la Unión Panamericana de Gimnasia, la Unión de la Alianza del Pacífico, Federaciones Nacionales de Gimnasia de otros países, y Comités Organizadores de acontecimientos deportivos. Transmitirlos a las Agencias de Viajes, con la finalidad de organizar los viajes a las competiciones, en que la FMG sea la responsable de la logística de viaje. Transmitirlos a los patrocinadores de la FMG, con la finalidad de recibir información de los productos y servicios de su interés.
                                </p>
                                <p>
                                    El consentimiento del titular sobre los datos anteriormente citados, es necesario para la formalización del ingreso al Sistema de Registro del Deporte Federado.
                                </p>
                                <p>
                                    El interesado acepta que la realización del registro de sus datos personales en el sistema de intranet de la FMG, implica su consentimiento de lo descrito en los párrafos anteriores.
                                </p>
                                <p className="font-semibold text-foreground pt-4">
                                    Derechos ARCO
                                </p>
                                <p>
                                    Usted tiene derecho de acceder, rectificar, y cancelar sus datos personales, así como de oponerse al tratamiento de los mismos o revocar el consentimiento que para tal fin nos haya otorgado. Para el ejercicio de sus derechos de Acceso, Rectificación, Cancelación y Oposición (ARCO), cuando sea legalmente procedente, puede enviar su solicitud a nuestras oficinas vía electrónica a través de la dirección info@fmgimnasia.org.mx donde con gusto le atendemos.
                                </p>
                            </div>
                        </ScrollArea>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
