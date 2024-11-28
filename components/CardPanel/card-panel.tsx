'use client'

import {ReactNode} from "react";
import Footer from "@/components/footer";
import styles from "./CardPanel.module.css";

interface CardPanelProps {
    children: ReactNode; // This allows a component to be passed as children
    width?: string;
    height?: string;
}

const CardPanel: React.FC<CardPanelProps> = ({children, width = '480px', height = 'auto'}) =>  {
    return (
        //todo define proper classes + pass width/height from prop
        /*<div className="w-[480px] p-16 bg-[#e6e8eb]/90 rounded-[48px] shadow border border-white/30 backdrop-blur-[32px] flex-col justify-start items-end gap-8 inline-flex">
            {children}
            <Footer></Footer>
        </div>*/

    <div className={styles.loginCard}>
        {children}
        <Footer></Footer>
    </div>
    );
}
export default CardPanel;