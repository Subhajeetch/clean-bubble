'use client';

import { createContext, useContext, useState } from 'react';

const OrderSuccessContext = createContext();

export const OrderSuccessProvider = ({ children }) => {
    const [isOrderSuccessOpen, setIsOrderSuccessOpen] = useState(false);

    const openOrderSuccess = () => setIsOrderSuccessOpen(true);
    const closeOrderSuccess = () => setIsOrderSuccessOpen(false);
    const setOrderSuccessState = (val) => setIsOrderSuccessOpen(val);

    return (
        <OrderSuccessContext.Provider value={{ isOrderSuccessOpen, openOrderSuccess, closeOrderSuccess, setOrderSuccessState }}>
            {children}
        </OrderSuccessContext.Provider>
    );
};

export const useOrderSuccess = () => useContext(OrderSuccessContext);