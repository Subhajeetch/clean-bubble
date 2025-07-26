'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

import cred from '@/mine.config';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [storeConfig, setStoreConfig] = useState({
        discountPercent: 0,
        bulkDiscountPercent: 0,
        bulkQuantityThreshold: 0,
    });
    // --- Internal Functions ---

    const getCart = async () => {
        const res = await axios.get('/api/cart');
        return res.data;
    };

    const updateCart = async (newCart) => {
        const res = await axios.post('/api/cart', { cart: newCart });
        return res.data;
    };

    // Fetch store config from backend
    const fetchStoreConfig = async () => {
        try {
            const res = await axios.get(`${cred.backendURL}/api/store/config`);
            if (res.data.success) {
                setStoreConfig({
                    discountPercent: res.data.discountPercent,
                    bulkDiscountPercent: res.data.bulkDiscountPercent,
                    bulkQuantityThreshold: res.data.bulkQuantityThreshold,
                });
            }
        } catch (err) {
            console.error('Failed to fetch store config', err);
        }
    };

    const addToCartApi = async (item) => {
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
    };

    const removeFromCartApi = async (itemId) => {
        const current = await getCart();
        const newCart = current
            .map((i) =>
                i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
            )
            .filter((i) => i.quantity > 0);

        return await updateCart(newCart);
    };

    const deleteFromCartApi = async (itemId) => {
        const current = await getCart();
        const newCart = current.filter((i) => i.id !== itemId);
        return await updateCart(newCart);
    };

    // --- Initial Fetch ---

    // Fetch initial cart and store config

    useEffect(() => {
        async function fetchCartAndConfig() {
            try {
                setLoading(true);
                const cart = await getCart();
                setCartItems(cart);
                await fetchStoreConfig();
            } catch (err) {
                console.error('Failed to fetch cart/config', err);
            } finally {
                setLoading(false);
            }
        }
        fetchCartAndConfig();
    }, []);

    // --- Exposed Functions ---

    const addToCart = async (item) => {
        try {
            setLoading(true);
            await addToCartApi(item);
            const cart = await getCart();
            setCartItems(cart);
            setLoading(false);
            return { success: true, message: 'Item added to cart' };
        } catch (error) {
            console.error('Failed to add item to cart', error);
            setLoading(false);
            return { success: false, message: 'Failed to add item to cart' };
        }
    };

    const removeFromCart = async (itemId) => {
        try {
            setLoading(true);
            await removeFromCartApi(itemId);
            const cart = await getCart();
            setCartItems(cart);
            setLoading(false);
            return { success: true, message: 'Item quantity decreased' };
        } catch (error) {
            console.error('Failed to remove item from cart', error);
            setLoading(false);
            return { success: false, message: 'Failed to remove item from cart' };
        }
    };

    const deleteFromCart = async (itemId) => {
        try {
            setLoading(true);
            await deleteFromCartApi(itemId);
            const cart = await getCart();
            setCartItems(cart);
            setLoading(false);
            return { success: true, message: 'Item removed from cart' };
        } catch (error) {
            console.error('Failed to delete item from cart', error);
            setLoading(false);
            return { success: false, message: 'Failed to delete item from cart' };
        }
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                loading,
                addToCart,
                removeFromCart,
                deleteFromCart,
                storeConfig
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
