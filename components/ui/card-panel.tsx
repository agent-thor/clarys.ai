'use client'

import {ReactNode} from "react";
import Footer from "@/components/footer";
import styles from "./CardPanel.module.css";

interface CardPanelProps {
    children: ReactNode; // This allows a component to be passed as children
    width?: string;
    height?: string;
}

const CardPanel: React.FC<CardPanelProps> = ({children, width = '480px', height = 'auto'}) => {
    return (
        <div
            className='flex flex-col p-16 gap-8 w-[480px] text-sm leading-6 font-normal font-clarys bg-backgroundOpac backdrop-blur-[32px] rounded-[48px] bg-card-panel'>
            {children}
            <Footer></Footer>
        </div>
    );
}
export default CardPanel;