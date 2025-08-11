import { cookies } from "next/headers";

export async function OPTIONS() {
    return new Response(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
        }
    });
}

export async function POST() {
    try {
        const cookieStore = await cookies();

        // Delete authentication cookies
        cookieStore.delete("accessToken");
        cookieStore.delete("refreshToken");

        return new Response(
            JSON.stringify({
                success: true,
                message: "Logged out successfully"
            }),
            {
                status: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": "true",
                    "Content-Type": "application/json"
                }
            }
        );
    } catch (error) {
        console.error('Logout error:', error);

        return new Response(
            JSON.stringify({
                success: false,
                message: "Internal server error during logout"
            }),
            {
                status: 500,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": "application/json"
                }
            }
        );
    }
}
