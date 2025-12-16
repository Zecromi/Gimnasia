
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
    tipo_aparatos_nac: boolean;
    tipo_aparatos_imp: boolean;
    tipo_aparatos_fig: boolean;
    tipo_aparatos_otros: boolean;
    latitud: null;
    longitud: null;
    asociacion: string;
    email: string;
    web: string;
    id_club_principal: string;
    fundacion: null;
    sector: string;
    tipo_instalaciones: string;
    tel1: string;
    tel2: string;
}

export interface ClubAddress {
    idClub: number;
    calle: string;
    exterior: string;
    interior: string;
    colonia: string;
    cp: string;
    tipo_domicilio: number;
}

export interface SetClubPayload {
    demoClub: ClubDefinition[];
    dirClub1: ClubAddress[];
    dirClub2: ClubAddress[];
}

export const createClub = async (payload: SetClubPayload) => {
    const response = await api.post("/SetClub", payload);
    return response.data;
};

export const mapStateToClubPayload = (data: any): SetClubPayload => {
    const getString = (key: string) => (data[key] as string) || "";
    // User requested booleans, but API says "varchar to int error", so we send 1 or 0.
    const getInt = (key: string) => (data[key] ? 1 : 0);

    const demoClub: ClubDefinition = {
        nombre: getString("nombre"),
        alias: getString("alias"),
        rfc: getString("rfc"),
        tipo_aparatos_nac: false,
        tipo_aparatos_imp: false,
        tipo_aparatos_fig: false,
        tipo_aparatos_otros: false,
        latitud: null,
        longitud: null,
        asociacion: getString("asociacion"),
        email: getString("email"),
        web: getString("web"),
        id_club_principal: "123",
        fundacion: null,
        sector: getString("sector"),
        tipo_instalaciones: getString("tipoInstalaciones"),
        tel1: getString("telPrincipal"),
        tel2: getString("telSecundario"),
    };

    const dirClub1: ClubAddress = {
        idClub: 1,
        calle: getString("calle"),
        exterior: getString("numExt"),
        interior: getString("numInt"),
        colonia: getString("colonia"),
        cp: getString("cp"),
        tipo_domicilio: 1, // Social as string "1"
    };

    const isIgual = !!data["igualDomicilio"];

    const dirClub2: ClubAddress = isIgual
        ? {
            ...dirClub1,
            tipo_domicilio: 0, // Fiscal as string "0"
        }
        : {
            idClub: 2,
            calle: getString("calleFiscal"),
            exterior: getString("numExtFiscal"),
            interior: getString("numIntFiscal"),
            colonia: getString("coloniaFiscal"),
            cp: getString("cpFiscal"),
            tipo_domicilio: 0 // Fiscal as string "0"
        };

    return {
        demoClub: [demoClub],
        dirClub1: [dirClub1],
        dirClub2: [dirClub2],
    };
};
