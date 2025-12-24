
import api from "./axios";

export interface Estado {
    id: number;
    Nombre: string;
}

export interface CatalogoItem {
    id: number;
    Nombre: string;
    Descripcion?: string | null;
}

export interface PuestoItem {
    id_puesto: number;
    Nombre: string;
    Descripcion?: string | null;
    Privilegios?: string;
}

export interface ModalidadItem {
    id: number;
    Nombre: string;
    Descripcion?: string;
    Alias?: string;
}

export interface ModalidadDetalleItem {
    id: number;
    Nombre: string;
    Alias: string;
    Nivel: string;
    titulo: string;
    edad_ini: number;
    edad_fin: number;
}

export interface CatalogsResponse {
    Estados: Estado[];
    Catalogo_afiliaciones: CatalogoItem[];
    Niveles_tecnicos: { id: number; Descripcion: string }[];
    Puestos: PuestoItem[];
    Escolaridad: CatalogoItem[];
    Modalidades: ModalidadItem[];
    View_Modalidades_detalle: ModalidadDetalleItem[];
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
    municipio: string;
    id_estado: string;
    cp: string;
    Tipo_domicilio: string;
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
    // Send "1" if true, "0" if false
    const getBoolString = (key: string) => (data[key] ? "1" : "0");

    // Format date from YYYY-MM-DD to DD/MM/YYYY if possible, else return original
    const formatDate = (dateStr: string) => {
        if (!dateStr) return "";
        // Assuming input type="date" returns YYYY-MM-DD
        const parts = dateStr.split("-");
        if (parts.length === 3) {
            return `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
        return dateStr;
    };

    const demoClub: ClubDefinition = {
        nombre: getString("nombre"),
        alias: getString("alias"),
        rfc: getString("rfc"),
        tipo_aparatos_nac: getBoolString("nacionales"),
        tipo_aparatos_imp: getBoolString("importados"),
        tipo_aparatos_fig: getBoolString("homologados"),
        tipo_aparatos_otros: getBoolString("otros"),
        latitud: "0",
        longitud: "0",
        asociacion: getString("asociacion"),
        email: getString("email"),
        web: getString("web"),
        id_club_principal: "", // keeping empty string as per prompt requirement
        fundacion: getString("fundacion"),
        sector: data["sector"] === "privado" ? "1" : "0", // 1 privado, 0 publico
        tipo_instalaciones: data["tipoInstalaciones"] === "rentadas" ? "1" : "0", // 1 rentada, 0 propia
        tel1: getString("telPrincipal"),
        tel2: getString("telSecundario"),
    };

    const dirClub1: ClubAddress = {
        calle: getString("calle"),
        exterior: getString("numExt"),
        interior: getString("numInt"),
        colonia: getString("colonia"),
        municipio: getString("municipio"),
        id_estado: getString("estado"),
        cp: getString("cp"),
        Tipo_domicilio: "Postal", // Fixed value
    };

    const isIgual = !!data["igualDomicilio"];

    const dirClub2: ClubAddress = isIgual
        ? {
            ...dirClub1,
            Tipo_domicilio: "Fiscal", // Fixed value
        }
        : {
            calle: getString("calleFiscal"),
            exterior: getString("numExtFiscal"),
            interior: getString("numIntFiscal"),
            colonia: getString("coloniaFiscal"),
            municipio: getString("municipioFiscal"),
            id_estado: getString("estadoFiscal"),
            cp: getString("cpFiscal"),
            Tipo_domicilio: "Fiscal", // Fixed value
        };

    return {
        demoClub: [demoClub],
        DirClub1: [dirClub1],
        DirClub2: [dirClub2],
    };
};

export interface ViewClubGral {
    Club: string;
    Alias: string;
    Email: string;
    Asociacion: string;
    membresia: boolean;
    Estatus: boolean;
}

export interface GetClubesResponse {
    View_Club_gral: ViewClubGral[];
}

export const getClubs = async () => {
    const response = await api.get<GetClubesResponse>("/GetClubes");
    return response.data;
};
