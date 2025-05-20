'use client'
import { createContext, useContext, useState } from 'react'

const EmblaContext = createContext(null)

export const useEmbla = () => useContext(EmblaContext)

export const EmblaProvider = ({ children }) => {
    const [emblaApi, setEmblaApi] = useState(null)

    return (
        <EmblaContext.Provider value={{ emblaApi, setEmblaApi }}>
            {children}
        </EmblaContext.Provider>
    )
}
