import { headers, cookies as getCookies } from 'next/headers';

export async function GET() {
    const cookieStore = getCookies();
    const cartCookie = cookieStore.get('cart');

    const cart = cartCookie ? JSON.parse(decodeURIComponent(cartCookie.value)) : [];

    return new Response(JSON.stringify(cart), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}

export async function POST(req) {
    const { cart } = await req.json();
    const cookieStore = getCookies();

    cookieStore.set('cart', encodeURIComponent(JSON.stringify(cart)), {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
    });

    return new Response(JSON.stringify({ success: true, message: "Cart updated", cart }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}
