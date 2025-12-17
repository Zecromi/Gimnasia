
import api from "./axios";

export interface Estado {
    id: number;
    Nombre: string;
}

export interface CatalogsResponse {
    Estados: Estado[];
    // Add other endpoint response fields here if needed in the future
}

export const getGlobalInfo = async () => {
    const response = await api.get<CatalogsResponse>("/GetInf");
    return response.data;
};

export interface ClubDefinition {
    nombre: string;
    alias: string;
    rfc: string;
    tipo_aparatos_nac: string;
    tipo_aparatos_imp: string;
    tipo_aparatos_fig: string;
    tipo_aparatos_otros: string;
    latitud: string;
    longitud: string;
    asociacion: string;
    email: string;
    web: string;
    id_club_principal: string;
    fundacion: string;
    sector: string;
    tipo_instalaciones: string;
    tel1: string;
    tel2: string;
}

export interface ClubAddress {
    calle: string;
    exterior: string;
    interior: string;
    colonia: string;
    cp: string;
    tipo_domicilio: string;
}

export interface SetClubPayload {
    demoClub: ClubDefinition[];
    DirClub1: ClubAddress[];
    DirClub2: ClubAddress[];
}

export const createClub = async (payload: SetClubPayload) => {
    const response = await api.post("/SetClub", payload);
    return response.data;
};

export const mapStateToClubPayload = (data: any): SetClubPayload => {
    const getString = (key: string) => (data[key] as string) || "";
    // User requested booleans, but API says "varchar to int error", so we send 1 or 0.
    const getInt = (key: string) => (data[key] ? "1" : "0");

    const demoClub: ClubDefinition = {
        nombre: getString("nombre"),
        alias: getString("alias"),
        rfc: getString("rfc"),
        tipo_aparatos_nac: "1",
        tipo_aparatos_imp: "0",
        tipo_aparatos_fig: "0",
        tipo_aparatos_otros: "0",
        latitud: "0",
        longitud: "0",
        asociacion: getString("asociacion"),
        email: getString("email"),
        web: getString("web"),
        id_club_principal: "123",
        fundacion: "10/12/2025",
        sector: "0",
        tipo_instalaciones: "0",
        tel1: getString("telPrincipal"),
        tel2: getString("telSecundario"),
    };

    const dirClub1: ClubAddress = {
        calle: getString("calle"),
        exterior: getString("numExt"),
        interior: getString("numInt"),
        colonia: getString("colonia"),
        cp: getString("cp"),
        tipo_domicilio: "postal", // Social as string "1"
    };

    const isIgual = !!data["igualDomicilio"];

    const dirClub2: ClubAddress = isIgual
        ? {
            ...dirClub1,
            tipo_domicilio: "postal", // Fiscal as string "0"
        }
        : {
            calle: getString("calleFiscal"),
            exterior: getString("numExtFiscal"),
            interior: getString("numIntFiscal"),
            colonia: getString("coloniaFiscal"),
            cp: getString("cpFiscal"),
            tipo_domicilio: "fiscal" // Fiscal as string "0"
        };

    return {
        demoClub: [demoClub],
        DirClub1: [dirClub1],
        DirClub2: [dirClub2],
    };
};
