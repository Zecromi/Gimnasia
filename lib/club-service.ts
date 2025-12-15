
import api from "./axios";

export interface ClubDefinition {
    nombre: string;
    alias: string;
    rfc: string;
    tipo_aparatos_nac: string; // "1" | "0"
    tipo_aparatos_imp: string; // "1" | "0"
    tipo_aparatos_fig: string; // "1" | "0"
    latitud: string;
    longitud: string;
    asociacion: string;
    email: string;
    web: string;
    id_club_principal: string;
    tel2: string;
    fecha_alta: string;
    fecha_baja: string;
    id_Puesto: number;
}

export interface ClubAddress {
    idClub: string;
    calle: string;
    exterior: string;
    interior: string;
    colonia: string;
    cp: string;
    nombre_contacto: string;
    nombre_contacto2: string;
    tipo_domicilio: string;
    telefono1: string;
    telefono2: string;
}

export interface SetClubPayload {
    demoClub: ClubDefinition[];
    dirClub1: ClubAddress[];
    dirClub2: ClubAddress[];
}

export const createClub = async (payload: SetClubPayload) => {
    const response = await api.post("/ApiServ/SetClub", payload);
    return response.data;
};

export const mapFormDataToClubPayload = (formData: FormData): SetClubPayload => {
    const getString = (key: string) => (formData.get(key) as string) || "";
    // Checkbox returns "on" if checked, null if not. Assuming "1" for true based on string type requirement.
    const getCheckbox = (key: string) => (formData.get(key) === "on" ? "1" : "0");

    const demoClub: ClubDefinition = {
        nombre: getString("nombre"),
        alias: getString("alias"),
        rfc: getString("rfc"),
        tipo_aparatos_nac: getCheckbox("nacionales"),
        tipo_aparatos_imp: getCheckbox("importados"),
        tipo_aparatos_fig: getCheckbox("homologados"),
        latitud: "",
        longitud: "",
        asociacion: getString("asociacion"),
        email: getString("email"),
        web: getString("web"),
        id_club_principal: "",
        tel2: getString("telSecundario"),
        fecha_alta: getString("fundacion"),
        fecha_baja: "",
        id_Puesto: 0,
    };

    const dirClub1: ClubAddress = {
        idClub: "",
        calle: getString("calle"),
        exterior: getString("numExt"),
        interior: getString("numInt"),
        colonia: getString("colonia"),
        cp: getString("cp"),
        nombre_contacto: "",
        nombre_contacto2: "",
        tipo_domicilio: "Social",
        telefono1: getString("telPrincipal"),
        telefono2: getString("telMovil"),
    };

    const isIgual = formData.get("igualDomicilio") === "on";

    const dirClub2: ClubAddress = isIgual
        ? {
            ...dirClub1,
            tipo_domicilio: "Fiscal",
        }
        : {
            idClub: "",
            calle: getString("calleFiscal"),
            exterior: getString("numExtFiscal"),
            interior: getString("numIntFiscal"),
            colonia: getString("coloniaFiscal"),
            cp: getString("cpFiscal"),
            nombre_contacto: "",
            nombre_contacto2: "",
            tipo_domicilio: "Fiscal",
            telefono1: "",
            telefono2: "",
        };

    return {
        demoClub: [demoClub],
        dirClub1: [dirClub1],
        dirClub2: [dirClub2],
    };
};
