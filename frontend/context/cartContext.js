'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
    getCart,
    addToCart as addToCartApi,
    removeFromCart as removeFromCartApi,
    deleteFromCart as deleteFromCartApi,
} from '@/lib/cartActions';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load cart from cookies
    useEffect(() => {
        async function fetchCart() {
            try {
                setLoading(true);
                const cart = await getCart();
                setCartItems(cart);
            } catch (err) {
                console.error('Failed to fetch cart', err);
            } finally {
                setLoading(false);
            }
        }

        fetchCart();
    }, []);

    const addToCart = async (item) => {
        try {
            setLoading(true);
            await addToCartApi(item);
            const cart = await getCart();
            setCartItems(cart);
            setLoading(false);
            return { success: true, message: "Item added to cart" };
        } catch (error) {
            console.error('Failed to add item to cart', error);
            setLoading(false);
            return { success: false, message: "Failed to add item to cart" };
        }
    };

    const removeFromCart = async (itemId) => {
        setLoading(true);
        await removeFromCartApi(itemId);
        const cart = await getCart();
        setCartItems(cart);
        setLoading(false);
        return { success: true, message: "Item quantity decreased" };
    };

    const deleteFromCart = async (itemId) => {
        setLoading(true);
        await deleteFromCartApi(itemId);
        const cart = await getCart();
        setCartItems(cart);
        setLoading(false);
        return { success: true, message: "Item removed from cart" };
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                loading,
                addToCart,
                removeFromCart,
                deleteFromCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
