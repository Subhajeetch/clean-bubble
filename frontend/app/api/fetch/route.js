// i made this universal proxy for all the api calls because i was having issues with cors and cookies, my backend is hosted on different domain and i wanted to use cookies for authentication, so i had to create this proxy to handle the requests and responses properly

// you wont need this if you just make your backend and frontend on the same domain, but if you want to use cookies for authentication and your backend is hosted on a different domain, you will need to use this proxy

// also there is a diffrent way to authenticate using barer token, but i wanted to use cookies for authentication, so i had to create this proxy to host this demo project.

// also claude gave me this code!!!!



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

        // Parse and build the complete target URL with query parameters
        const targetUrlObj = new URL(targetUrl);

        // Get all search params except 'url' and append them to target URL
        searchParams.forEach((value, key) => {
            if (key !== 'url') {
                targetUrlObj.searchParams.set(key, value);
            }
        });

        const finalTargetUrl = targetUrlObj.toString();

        const cookieStore = await cookies();
        const allCookies = cookieStore.getAll();
        let cookieString = "";

        if (allCookies && allCookies.length > 0) {
            cookieString = allCookies
                .map(cookie => `${cookie.name}=${cookie.value}`)
                .join('; ');
        }

        const headers = {
            "Content-Type": "application/json",
            "User-Agent": request.headers.get("user-agent") || "NextJS-Proxy/1.0"
        };

        if (cookieString) {
            headers.Cookie = cookieString;
        }

        // Prepare axios config with final URL including all query parameters
        const axiosConfig = {
            method: method.toLowerCase(),
            url: finalTargetUrl,
            headers: headers,
            timeout: 30000,
            withCredentials: false,
            validateStatus: function (status) {
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
            setCookieHeaders.forEach(cookieHeader => {
                try {
                    const [nameValue, ...options] = cookieHeader.split(';');
                    const [name, value] = nameValue.trim().split('=');

                    if (name && value) {
                        const cookieOptions = {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === 'production',
                            sameSite: 'strict',
                            path: '/'
                        };

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

                        cookieStore.set(name, value, cookieOptions);
                    }
                } catch (cookieError) {
                    console.error('Error parsing cookie:', cookieError);
                }
            });
        }

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

        if (error.response) {
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
