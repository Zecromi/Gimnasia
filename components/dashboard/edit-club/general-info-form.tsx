"use client"

import * as React from "react"
import { useFormContext } from "react-hook-form"
import { CircleFadingArrowUp } from "lucide-react"

import { Input } from "@/components/ui/input"
import { InputGroup } from "@/components/ui/input-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

import { ViewClubGral, Estado } from "@/lib/club-service"

function CheckboxInput({ name }: { name: string }) {
    const { watch, setValue } = useFormContext()
    const value = watch(name)

    return (
        <Checkbox
            id={name}
            checked={!!value}
            onCheckedChange={(checked) => setValue(name, !!checked)}
        />
    )
}

export function GeneralInfoForm({ id, club, estados }: { id: string, club: ViewClubGral, estados: Estado[] }) {
    const { register } = useFormContext()

    return (
        <div className="space-y-6">
            {/* General Info */}
            <div className="grid gap-6">
                <div className="grid grid-cols-12 gap-6">
                    <InputGroup label="Nombre del club *" htmlFor="nombre" className="col-span-12 md:col-span-6">
                        <Input id="nombre" {...register("nombre")} />
                    </InputGroup>
                    <InputGroup label="Asociación *" className="col-span-12 md:col-span-4">
                        <Input disabled className="bg-muted/50" {...register("asociacion")} />
                    </InputGroup>
                    <InputGroup label="Alias" htmlFor="alias" className="col-span-12 md:col-span-2">
                        <Input id="alias" {...register("alias")} />
                    </InputGroup>
                </div>
                <div className="grid grid-cols-12 gap-6">
                    <InputGroup label="E-mail *" htmlFor="email" className="col-span-12 md:col-span-4">
                        <Input id="email" type="email" {...register("email")} />
                    </InputGroup>
                    <InputGroup label="Pagina web" htmlFor="web" className="col-span-12 md:col-span-4">
                        <Input id="web" {...register("web")} />
                    </InputGroup>
                    <InputGroup label="Fundación" htmlFor="fundacion" className="col-span-12 md:col-span-2">
                        <Input id="fundacion" type="date" {...register("fundacion")} />
                    </InputGroup>
                    <div className="col-span-12 md:col-span-2 space-y-3">
                        <Label>Sector</Label>
                        <div className="flex gap-4">
                            <div className="flex items-center space-x-2">
                                <input type="radio" id="privado" value="privado" {...register("sector")} className="aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" />
                                <Label htmlFor="privado">Privado</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input type="radio" id="publico" value="publico" {...register("sector")} className="aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" />
                                <Label htmlFor="publico">Publico</Label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-12 gap-6">
                    <InputGroup label="Teléfono principal *" htmlFor="tel-principal" className="col-span-12 md:col-span-3">
                        <Input id="tel-principal" {...register("telPrincipal")} />
                    </InputGroup>
                    <InputGroup label="Teléfono secundario" htmlFor="tel-secundario" className="col-span-12 md:col-span-3">
                        <Input id="tel-secundario" {...register("telSecundario")} />
                    </InputGroup>
                    <InputGroup label="Teléfono móvil *" htmlFor="tel-movil" className="col-span-12 md:col-span-3">
                        <Input id="tel-movil" {...register("telMovil")} />
                    </InputGroup>
                    <div className="col-span-12 md:col-span-3 space-y-3">
                        <Label>Tipo de instalaciones</Label>
                        <div className="flex gap-4">
                            <div className="flex items-center space-x-2">
                                <input type="radio" id="propias" value="propias" {...register("tipoInstalaciones")} className="aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" />
                                <Label htmlFor="propias">Propias</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input type="radio" id="rentadas" value="rentadas" {...register("tipoInstalaciones")} className="aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" />
                                <Label htmlFor="rentadas">Rentadas</Label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox id="organismos" onCheckedChange={(c) => register("organismos").onChange({ target: { checked: c, name: "organismos" } })} />
                    <Label htmlFor="organismos">Organismos afines: Si</Label>
                </div>
            </div>

            {/* Domicilio Social */}
            <div className="space-y-6">
                <h3 className="text-lg font-semibold bg-muted py-2 px-4 rounded-md">Domicilio Social :</h3>
                <div className="grid grid-cols-12 gap-6">
                    <InputGroup label="Calle *" htmlFor="calle" className="col-span-12 md:col-span-6">
                        <Input id="calle" {...register("calle")} />
                    </InputGroup>
                    <InputGroup label="# Exterior *" htmlFor="num-ext" className="col-span-6 md:col-span-2">
                        <Input id="num-ext" {...register("numExt")} />
                    </InputGroup>
                    <InputGroup label="# Interior" htmlFor="num-int" className="col-span-6 md:col-span-2">
                        <Input id="num-int" {...register("numInt")} />
                    </InputGroup>
                    <InputGroup label="Colonia *" htmlFor="colonia" className="col-span-12 md:col-span-2">
                        <Input id="colonia" {...register("colonia")} />
                    </InputGroup>
                </div>
                <div className="grid grid-cols-12 gap-6">
                    <InputGroup label="CD / Delegación / Municipio *" htmlFor="municipio" className="col-span-12 md:col-span-4">
                        <Input id="municipio" {...register("municipio")} />
                    </InputGroup>
                    <InputGroup label="Estado *" className="col-span-12 md:col-span-4">
                        <select className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" {...register("estado")}>
                            <option value="">Seleccione una opción</option>
                            {estados?.map((estado) => (
                                <option key={estado.id} value={estado.id.toString()}>{estado.Nombre}</option>
                            ))}
                        </select>
                    </InputGroup>
                    <InputGroup label="C.P. *" htmlFor="cp" className="col-span-12 md:col-span-2">
                        <Input id="cp" {...register("cp")} />
                    </InputGroup>
                </div>
            </div>

            {/* Domicilio Fiscal */}
            <div className="space-y-6">
                <h3 className="text-lg font-semibold bg-muted py-2 px-4 rounded-md">Domicilio Fiscal :</h3>
                <div className="flex items-center space-x-2">
                    <Checkbox id="igual-domicilio" onCheckedChange={(c) => register("igualDomicilio").onChange({ target: { checked: c, name: "igualDomicilio" } })} />
                    <Label htmlFor="igual-domicilio">Igual a domicilio social</Label>
                </div>
                <div className="grid grid-cols-12 gap-6">
                    <InputGroup label="Calle *" htmlFor="calle-fiscal" className="col-span-12 md:col-span-6">
                        <Input id="calle-fiscal" {...register("calleFiscal")} />
                    </InputGroup>
                    <InputGroup label="# Exterior *" htmlFor="num-ext-fiscal" className="col-span-6 md:col-span-2">
                        <Input id="num-ext-fiscal" {...register("numExtFiscal")} />
                    </InputGroup>
                    <InputGroup label="# Interior" htmlFor="num-int-fiscal" className="col-span-6 md:col-span-2">
                        <Input id="num-int-fiscal" {...register("numIntFiscal")} />
                    </InputGroup>
                    <InputGroup label="Colonia *" htmlFor="colonia-fiscal" className="col-span-12 md:col-span-2">
                        <Input id="colonia-fiscal" {...register("coloniaFiscal")} />
                    </InputGroup>
                </div>
                <div className="grid grid-cols-12 gap-6">
                    <InputGroup label="CD / Delegación / Municipio *" htmlFor="municipio-fiscal" className="col-span-12 md:col-span-4">
                        <Input id="municipio-fiscal" {...register("municipioFiscal")} />
                    </InputGroup>
                    <InputGroup label="Estado *" className="col-span-12 md:col-span-4">
                        <select className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" {...register("estadoFiscal")}>
                            <option value="">Seleccione una opción</option>
                            {estados?.map((estado) => (
                                <option key={estado.id} value={estado.id.toString()}>{estado.Nombre}</option>
                            ))}
                        </select>
                    </InputGroup>
                    <InputGroup label="C.P. *" htmlFor="cp-fiscal" className="col-span-6 md:col-span-2">
                        <Input id="cp-fiscal" {...register("cpFiscal")} />
                    </InputGroup>
                    <InputGroup label="RFC *" htmlFor="rfc" className="col-span-6 md:col-span-2">
                        <Input id="rfc" {...register("rfc")} />
                    </InputGroup>
                </div>
            </div>

            {/* Aparatos */}
            <div className="space-y-6">
                <h3 className="text-lg font-semibold bg-muted py-2 px-4 rounded-md">Aparatos :</h3>
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-6 md:col-span-3 space-y-3">
                        <Label>Nacionales:</Label>
                        <div className="flex items-center space-x-2">
                            <CheckboxInput name="nacionales" />
                            <Label htmlFor="nacionales">Si</Label>
                        </div>
                    </div>
                    <div className="col-span-6 md:col-span-3 space-y-3">
                        <Label>Importados:</Label>
                        <div className="flex items-center space-x-2">
                            <CheckboxInput name="importados" />
                            <Label htmlFor="importados">Si</Label>
                        </div>
                    </div>
                    <div className="col-span-6 md:col-span-3 space-y-3">
                        <Label>Homologados FIG:</Label>
                        <div className="flex items-center space-x-2">
                            <CheckboxInput name="homologados" />
                            <Label htmlFor="homologados">Si</Label>
                        </div>
                    </div>
                    <div className="col-span-6 md:col-span-3 space-y-3">
                        <Label>Aparatos otros:</Label>
                        <div className="flex items-center space-x-2">
                            <CheckboxInput name="otros" />
                            <Label htmlFor="otros">Si</Label>
                        </div>
                    </div>
                </div>
                <div className="p-4 border-t bg-background mt-auto">
                    <div className="flex justify-end">
                        <Button type="submit" className="w-[100px]">
                            <CircleFadingArrowUp className="mr-2 h-4 w-4" />
                            Guardar
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
