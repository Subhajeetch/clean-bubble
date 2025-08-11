// app/api/auth/login/route.js
import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

import { comparePassword } from '@/lib/hashPass';
import { validateEmail } from '@/lib/validateEmail';
import generate from '@/lib/generateTokens';

export async function POST(request) {
    try {
        const body = await request.json();
        const { identifier, password } = body; // email or phone

        if (!identifier || !password) {
            return NextResponse.json({
                success: false,
                message: 'Email/Phone and password are required!'
            }, { status: 400 });
        }

        const isEmail = validateEmail(identifier);

        // Connect to database
        const client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        const db = client.db('clean_bubble');
        const users = db.collection('users');

        // Find user by email or phone
        let user;
        try {
            if (isEmail) {
                user = await users.findOne({ email: identifier.toLowerCase().trim() });
            } else {
                user = await users.findOne({ phone: identifier });
            }
        } catch (error) {
            await client.close();
            console.error('Error finding user:', error);
            return NextResponse.json({
                success: false,
                message: 'Something went wrong!'
            }, { status: 500 });
        }

        // Close database connection
        await client.close();

        if (!user) {
            return NextResponse.json({
                success: false,
                message: 'Wrong credentials'
            }, { status: 401 });
        }

        // Check password
        let isMatch;
        try {
            isMatch = await comparePassword(password, user.password);
        } catch (error) {
            console.error('Error comparing password:', error);
            return NextResponse.json({
                success: false,
                message: 'Something went wrong!'
            }, { status: 500 });
        }

        if (!isMatch) {
            return NextResponse.json({
                success: false,
                message: 'Incorrect Password'
            }, { status: 401 });
        }

        // Generate JWT tokens
        let accessToken, refreshToken;
        try {
            accessToken = generate.accessToken(user);
            refreshToken = generate.refreshToken(user);
        } catch (error) {
            console.error('Error generating tokens:', error);
            return NextResponse.json({
                success: false,
                message: 'Something went wrong!'
            }, { status: 500 });
        }

        // Remove password before sending user object
        const userObj = { ...user };
        delete userObj.password;

        // Create response
        const response = NextResponse.json({
            success: true,
            message: 'Login successful',
            user: userObj
        }, { status: 200 });

        // Set cookies
        response.cookies.set('accessToken', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 15 * 60 * 1000 // 15 minutes
        });

        response.cookies.set('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });

        return response;

    } catch (err) {
        console.error('Unexpected error in /login:', err);
        return NextResponse.json({
            success: false,
            message: 'Something went wrong!'
        }, { status: 500 });
    }
}

// Handle other HTTP methods
export async function GET() {
    return NextResponse.json({
        success: false,
        message: 'Method not allowed'
    }, { status: 405 });
}
