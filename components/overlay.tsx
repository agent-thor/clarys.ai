'use client'

import {createContext, ReactNode, useContext, useState} from "react";

interface OverlayContextType {
    isOpen: boolean;
    openOverlay: (content: ReactNode) => void;
    closeOverlay: () => void;
    content: ReactNode;
}

const Overlay = createContext<OverlayContextType | undefined>(undefined);

export const useOverlay = (): OverlayContextType => {
    const context = useContext(Overlay);
    if (!context) {
        throw new Error('useOverlay must be used within an OverlayProvider');
    }
    return context;
};

interface OverlayProviderProps {
    children: ReactNode;
}

export const OverlayProvider: React.FC<OverlayProviderProps> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [content, setContent] = useState<ReactNode>(null);

    const openOverlay = (overlayContent: ReactNode) => {
        setContent(overlayContent);
        setIsOpen(true);
    };

    const closeOverlay = () => {
        setIsOpen(false);
        setContent(null);
    };
    return (
        <Overlay.Provider value={{ isOpen, openOverlay, closeOverlay, content }}>
            {children}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/20 backdrop-blur-[20px] ">
                    <div className="relative w-full max-w-md bg-background rounded-[48px] border-[#ffffff52] border">
                        <button
                            onClick={closeOverlay}
                            className="absolute top-8 right-8 text-gray-500 hover:text-gray-800"
                            aria-label="Close Panel"
                        >
                            &times;
                        </button>
                        <div className="p-16">{content}</div>
                    </div>
                </div>
            )}
        </Overlay.Provider>
    );
};
