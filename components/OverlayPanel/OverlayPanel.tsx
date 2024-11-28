'use client'
import React, {ReactNode} from 'react';
import styles from "./OverlayPanel.module.css"
import {useOverlay} from "@/components/OverlayPanel/OverlayContext";

interface OverlayPanelProps {
    children?: ReactNode; // This allows a component to be passed as children
}

const OverlayPanel: React.FC<OverlayPanelProps> = ({children}) => {
    const {isOpen, closeOverlay} = useOverlay();

    if (!isOpen) return null; // Don't render if the overlay is not open

    return (
        <>
            {/* Overlay Background */}
            <div className={styles.overlay} onClick={closeOverlay}></div>

            {/* Panel Content */}
            <div className="overlayPanel">
                <button className="closeButton" onClick={closeOverlay}>X</button>
                <div className="overlayContent">
                    {children}
                    content
                </div>
            </div>

            <style jsx>{`
              
            `}</style>
        </>
    );
};

export default OverlayPanel;
