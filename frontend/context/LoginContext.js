'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
    const [isLoginOpen, setIsLoginOpen] = useState(false);

    const openLogin = () => setIsLoginOpen(true);
    const closeLogin = () => setIsLoginOpen(false);
    const setLoginState = (val) => setIsLoginOpen(val);

    return (
        <LoginContext.Provider value={{ isLoginOpen, openLogin, closeLogin, setLoginState }}>
            {children}
        </LoginContext.Provider>
    );
};

export const useLogin = () => useContext(LoginContext);