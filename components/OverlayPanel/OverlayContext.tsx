'use client'

import {createContext, ReactNode, useContext, useState} from "react";

interface OverlayContextType {
    isOpen: boolean;
    openOverlay: () => void;
    closeOverlay: () => void;
}

const OverlayContext = createContext<OverlayContextType | undefined>(undefined);

export const useOverlay = (): OverlayContextType => {
    const context = useContext(OverlayContext);
    if (!context) {
        throw new Error('useOverlay must be used within an OverlayProvider');
    }
    return context;
};

interface OverlayProviderProps {
    children: ReactNode;
}

export const OverlayProvider: React.FC<OverlayProviderProps> = ({ children }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const openOverlay = () => setIsOpen(true);
    const closeOverlay = () => setIsOpen(false);

    return (
        <OverlayContext.Provider value={{ isOpen, openOverlay, closeOverlay }}>
            {children}
        </OverlayContext.Provider>
    );
};
