import { cookies } from "next/headers";
import axios from "axios";

export async function OPTIONS() {
    return new Response(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Credentials": "true"
        }
    });
}

async function handleRequest(request, method) {
    try {
        // Get the target URL from query parameters
        const { searchParams } = new URL(request.url);
        const targetUrl = searchParams.get('url');

        if (!targetUrl) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Missing 'url' parameter"
                }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Credentials": "true"
                    }
                }
            );
        }

        const cookieStore = await cookies();

        // Get all cookies and format them for cookie-parser
        const allCookies = cookieStore.getAll();
        let cookieString = "";

        if (allCookies && allCookies.length > 0) {
            cookieString = allCookies
                .map(cookie => `${cookie.name}=${cookie.value}`)
                .join('; ');
        }

        // Prepare headers for axios request
        const headers = {
            "Content-Type": "application/json",
            "User-Agent": request.headers.get("user-agent") || "NextJS-Proxy/1.0"
        };

        // Add cookies to headers if they exist
        if (cookieString) {
            headers.Cookie = cookieString;
        }

        // Prepare axios config
        const axiosConfig = {
            method: method.toLowerCase(),
            url: targetUrl,
            headers: headers,
            timeout: 30000, // 30 second timeout
            withCredentials: false, // We're handling cookies manually
            validateStatus: function (status) {
                // Don't throw errors for any status code
                return status >= 200 && status < 600;
            }
        };

        // Add request body for POST, PUT, PATCH requests
        if (method !== 'GET' && method !== 'DELETE' && method !== 'HEAD') {
            try {
                const contentType = request.headers.get('content-type');

                if (contentType && contentType.includes('application/json')) {
                    const body = await request.json();
                    axiosConfig.data = body;
                } else {
                    const body = await request.text();
                    if (body) {
                        axiosConfig.data = body;
                        axiosConfig.headers['Content-Type'] = contentType || 'text/plain';
                    }
                }
            } catch (error) {
                console.log("No body in request or invalid JSON");
            }
        }

        // Make the axios request to your Express backend
        const backendResponse = await axios(axiosConfig);

        // Prepare response headers
        const responseHeaders = {
            "Content-Type": backendResponse.headers['content-type'] || "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": "true"
        };

        // Handle cookies from backend response
        const setCookieHeaders = backendResponse.headers['set-cookie'];
        if (setCookieHeaders && Array.isArray(setCookieHeaders)) {
            const cookieStore = await cookies();

            setCookieHeaders.forEach(cookieHeader => {
                try {
                    // Parse cookie header (format: "name=value; options")
                    const [nameValue, ...options] = cookieHeader.split(';');
                    const [name, value] = nameValue.trim().split('=');

                    if (name && value) {
                        // Parse cookie options
                        const cookieOptions = {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === 'production',
                            sameSite: 'strict',
                            path: '/'
                        };

                        // Override with options from backend if present
                        options.forEach(option => {
                            const [key, val] = option.trim().split('=');
                            switch (key.toLowerCase()) {
                                case 'path':
                                    cookieOptions.path = val || '/';
                                    break;
                                case 'domain':
                                    cookieOptions.domain = val;
                                    break;
                                case 'secure':
                                    cookieOptions.secure = true;
                                    break;
                                case 'httponly':
                                    cookieOptions.httpOnly = true;
                                    break;
                                case 'samesite':
                                    cookieOptions.sameSite = val || 'strict';
                                    break;
                                case 'max-age':
                                    cookieOptions.maxAge = parseInt(val);
                                    break;
                            }
                        });

                        // Set the cookie
                        cookieStore.set(name, value, cookieOptions);
                    }
                } catch (cookieError) {
                    console.error('Error parsing cookie:', cookieError);
                }
            });
        }

        // Prepare response data
        let responseData;
        if (typeof backendResponse.data === 'string') {
            responseData = backendResponse.data;
        } else {
            responseData = JSON.stringify(backendResponse.data);
        }

        return new Response(responseData, {
            status: backendResponse.status,
            headers: responseHeaders
        });

    } catch (error) {
        console.error('Proxy error:', error);

        // Handle axios errors specifically
        if (error.response) {
            // Backend responded with error status
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Backend error",
                    error: error.response.data || error.message,
                    status: error.response.status
                }),
                {
                    status: error.response.status,
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Credentials": "true"
                    }
                }
            );
        } else if (error.request) {
            // Network error
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Network error - unable to reach backend",
                    error: "NETWORK_ERROR"
                }),
                {
                    status: 503,
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Credentials": "true"
                    }
                }
            );
        } else {
            // Other error
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Proxy server error",
                    error: error.message
                }),
                {
                    status: 500,
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Credentials": "true"
                    }
                }
            );
        }
    }
}

export async function GET(request) {
    return handleRequest(request, 'GET');
}

export async function POST(request) {
    return handleRequest(request, 'POST');
}

export async function PUT(request) {
    return handleRequest(request, 'PUT');
}

export async function DELETE(request) {
    return handleRequest(request, 'DELETE');
}

export async function PATCH(request) {
    return handleRequest(request, 'PATCH');
}
