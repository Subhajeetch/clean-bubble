// app/api/auth/get/user/route.js
import { MongoClient, ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import generate from '@/lib/generateTokens';
import verify from '@/lib/verifyTokens';

export async function GET(request) {
    try {
        // Get cookies from the request (await the cookies() call)
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('accessToken')?.value;
        const refreshToken = cookieStore.get('refreshToken')?.value;

        // console.log({
        //     accessToken: accessToken,
        //     refreshToken: refreshToken
        // });

        if (!accessToken && !refreshToken) {
            return NextResponse.json({
                success: false,
                message: "Not authenticated"
            }, { status: 401 });
        }

        let decodedUser = null;
        let newAccessToken = null;

        // Try to verify access token first
        if (accessToken) {
            try {
                decodedUser = await verify.accessToken(accessToken);
            } catch (error) {
                console.error("Access token invalid:", error);
                decodedUser = null;
            }
        }

        // If access token is invalid, try refresh token
        if (!decodedUser && refreshToken) {
            try {
                decodedUser = await verify.refreshToken(refreshToken);
            } catch (error) {
                console.error("Refresh token invalid:", error);
                return NextResponse.json({
                    success: false,
                    message: "Unauthorized"
                }, { status: 401 });
            }
        }

        if (!decodedUser) {
            return NextResponse.json({
                success: false,
                message: "Invalid or expired tokens"
            }, { status: 401 });
        }

        // Connect to database
        const client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        const db = client.db('clean_bubble');
        const users = db.collection('users');

        // Find user by ID from decoded token
        let user;
        try {
            user = await users.findOne({ _id: new ObjectId(decodedUser.sub) });
        } catch (error) {
            await client.close();
            console.error("Error finding user:", error);
            return NextResponse.json({
                success: false,
                message: "User not found"
            }, { status: 404 });
        }

        // Close database connection
        await client.close();

        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User not found"
            }, { status: 404 });
        }

        // Generate new access token if we have a decoded user
        if (decodedUser) {
            const tempUser = {
                _id: decodedUser.sub,
                email: user.email
            };
            newAccessToken = generate.accessToken(tempUser);
        }

        // Remove password before sending user object
        delete user.password;

        // Create response
        const response = NextResponse.json({
            success: true,
            message: "Login verified!",
            user
        }, { status: 200 });

        // Set new access token cookie if generated
        if (newAccessToken) {
            response.cookies.set('accessToken', newAccessToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                maxAge: 15 * 60 * 1000 // 15 minutes
            });
        }

        return response;

    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json({
            success: false,
            message: "Unauthorized"
        }, { status: 401 });
    }
}

// Handle other HTTP methods
export async function POST() {
    return NextResponse.json({
        success: false,
        message: 'Method not allowed'
    }, { status: 405 });
}
