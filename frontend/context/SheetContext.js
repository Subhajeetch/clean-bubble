'use client';

import { createContext, useContext, useState } from 'react';

const SheetContext = createContext();

export const SheetProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const openSheet = () => setIsOpen(true);
    const closeSheet = () => setIsOpen(false);
    const setSheetState = (val) => setIsOpen(val);

    return (
        <SheetContext.Provider value={{ isOpen, openSheet, closeSheet, setSheetState }}>
            {children}
        </SheetContext.Provider>
    );
};

export const useSheet = () => useContext(SheetContext);

