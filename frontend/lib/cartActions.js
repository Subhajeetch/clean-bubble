import axios from 'axios';

export async function getCart() {
    const res = await axios.get('/api/cart');
    return res.data;
}

export async function updateCart(newCart) {
    const res = await axios.post('/api/cart', { cart: newCart });
    return res.data;
}

export async function addToCart(item) {
    const current = await getCart();
    const existing = current.find((i) => i.id === item.id);

    let newCart;

    if (existing) {
        newCart = current.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
    } else {
        newCart = [...current, { ...item, quantity: 1 }];
    }

    return await updateCart(newCart);
}

export async function removeFromCart(itemId) {
    const current = await getCart();
    const newCart = current
        .map((i) =>
            i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
        )
        .filter((i) => i.quantity > 0);

    return await updateCart(newCart);
}

export async function deleteFromCart(itemId) {
    const current = await getCart();
    const newCart = current.filter((i) => i.id !== itemId);
    return await updateCart(newCart);
}

