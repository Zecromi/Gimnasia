
import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const response = await axios.post("https://www.conjurweb.com/ApiServ/SetClub", body, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return NextResponse.json(response.data);
    } catch (error: any) {
        console.error("Error creating club:", error);
        return NextResponse.json(
            error.response?.data || { error: "Error creating club" },
            { status: error.response?.status || 500 }
        );
    }
}
