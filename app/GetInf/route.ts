
import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
    try {
        const response = await axios.get("https://www.conjurweb.com/ApiServ/GetInf");
        return NextResponse.json(response.data);
    } catch (error: any) {
        console.error("Error fetching global info:", error);
        return NextResponse.json(
            { error: "Error fetching global info" },
            { status: error.response?.status || 500 }
        );
    }
}
