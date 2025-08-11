import { MongoClient } from 'mongodb';
import validator from 'validator';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { hashPassword } from '@/lib/hashPass';
import generate from '@/lib/generateTokens';

export async function POST(request) {
    try {
        const body = await request.json();
        const { fullName, email, password, phone } = body;

        // Validate required fields (matching your validateSigninBody logic)
        const requiredFields = ["fullName", "password", "email"];
        const missingFields = [];

        requiredFields.forEach(field => {
            if (!body[field]) {
                missingFields.push(field);
            }
        });

        if (missingFields.length > 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: `Missing: ${missingFields.join(', ')}`
                },
                { status: 400 }
            );
        }

        // Normalize email (matching your logic)
        const normalizeEmail = email?.toLowerCase().trim();
        if (!normalizeEmail) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Email is required'
                },
                { status: 400 }
            );
        }

        // Validate email format
        if (!validator.isEmail(normalizeEmail)) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Please provide a valid email address'
                },
                { status: 400 }
            );
        }

        // Hash password
        let hashedPassword;
        try {
            hashedPassword = await hashPassword(password);
        } catch (err) {
            console.error('Error hashing password:', err);
            return NextResponse.json(
                {
                    success: false,
                    message: 'Something went wrong!'
                },
                { status: 500 }
            );
        }

        // Connect to database
        const client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        const db = client.db('clean_bubble');
        const users = db.collection('users');

        // Check if user already exists
        const existingUser = await users.findOne({ email: normalizeEmail });
        if (existingUser) {
            await client.close();
            return NextResponse.json(
                {
                    success: false,
                    message: 'Email already exists'
                },
                { status: 409 }
            );
        }

        // Create user data (matching your structure)
        const userData = {
            fullName,
            email: normalizeEmail,
            phone: phone ? phone : null,
            password: hashedPassword,
            createdAt: new Date()
        };

        // Save user
        let result;
        try {
            result = await users.insertOne(userData);
        } catch (err) {
            await client.close();
            // Handle duplicate key error (just in case)
            if (err.code === 11000) {
                return NextResponse.json(
                    {
                        success: false,
                        message: 'Email already exists'
                    },
                    { status: 409 }
                );
            }
            console.error('Error saving user:', err);
            return NextResponse.json(
                {
                    success: false,
                    message: 'Something went wrong!'
                },
                { status: 500 }
            );
        }

        // Close database connection
        await client.close();

        // Create user object for token generation and response
        const userForToken = {
            _id: result.insertedId,
            fullName: userData.fullName,
            email: userData.email,
            phone: userData.phone
        };

        // Generate JWT tokens
        const accessToken = generate.accessToken(userForToken);
        const refreshToken = generate.refreshToken(userForToken);

        // Create response
        const response = NextResponse.json(
            {
                success: true,
                message: 'User signed up successfully',
                user: {
                    _id: result.insertedId,
                    fullName: userData.fullName,
                    email: userData.email,
                    phone: userData.phone,
                    createdAt: userData.createdAt
                }
            },
            { status: 201 }
        );

        // Set cookies (matching your cookie configuration)
        response.cookies.set('accessToken', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000 // 15 minutes
        });

        response.cookies.set('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });

        console.log('User signed up:', {
            _id: result.insertedId,
            fullName: userData.fullName,
            email: userData.email,
            phone: userData.phone,
            createdAt: userData.createdAt
        });

        return response;

    } catch (err) {
        console.error('Unexpected error in /signup:', err);
        return NextResponse.json(
            {
                success: false,
                message: 'Something went wrong!'
            },
            { status: 500 }
        );
    }
}

// Handle other HTTP methods
export async function GET() {
    return NextResponse.json(
        {
            success: false,
            message: 'Method not allowed'
        },
        { status: 405 }
    );
}
