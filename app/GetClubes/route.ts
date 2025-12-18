import { NextResponse } from "next/server";
import api from "@/lib/axios";

export async function GET() {
    try {
        // Direct call to external API to avoid infinite loop with local calls if axios base URL is handled poorly
        // But we use the axios instance which might point to local... 
        // Wait, the previous proxies use `api` from `@/lib/axios`. 
        // If `@/lib/axios` points to localhost, this is a loop.
        // Let's check `lib/axios.ts` to see baseURL. 
        // Actually, previous proxies used `api` and they worked (or communicated). 
        // BUT `SetClub` route calls `api.post("/SetClub")`... wait.
        // If `lib/axios` baseURL is the external API, then `app/SetClub/route` calling `api.post` is fine?
        // NO, the service calls the proxy. The PROXY must call the External API.
        // The previous `app/SetClub/route.ts` used `axios` directly or the `api` instance? 
        // Let's assume `api` instance has the external base URL? 
        // If `lib/axios.ts` has `https://www.conjurweb.com/ApiServ`, then the client `club-service` using `api` calls the external API directly -> CORS.
        // The Service functions were updated to call `/SetClub` (relative) which hits the Next.js proxy.
        // The PROXY `app/SetClub/route.ts` must call explicitly `https://www.conjurweb.com/ApiServ/SetClub`.
        // Let's verify `app/SetClub/route.ts` content from memory or previous read.
        // Step 161 (create SetClub) used:
        // const response = await axios.post("https://www.conjurweb.com/ApiServ/SetClub", ...);
        // So I should use `axios` directly here too, NOT `api` if `api` is configured for something else or if I want to be explicit.

        const response = await fetch("https://www.conjurweb.com/ApiServ/GetClubes", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`External API error: ${response.statusText}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error("Error fetching clubs:", error);
        return NextResponse.json(
            { error: "Error fetching clubs" },
            { status: 500 }
        );
    }
}
