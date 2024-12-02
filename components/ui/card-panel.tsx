'use client'

import {ReactNode} from "react";
import Footer from "@/components/footer";

interface CardPanelProps {
    children: ReactNode; // This allows a component to be passed as children
    width?: string;
    blur?: string;
}

const CardPanel: React.FC<CardPanelProps> = ({children, width = '480px', blur = '32px'}) => {
    let classes = 'flex flex-col p-16 gap-8 text-sm leading-6 font-normal font-clarys rounded-[48px] bg-card-panel bg-backgroundOpac';
    classes += ` backdrop-blur-[${blur}]`;
    classes += ` w-[${width}]`;

    return (
        <div className={classes}>
            {children}
            <Footer></Footer>
        </div>
    );
}
/*<div className={cn(
    'flex flex-col p-16 gap-8 text-sm leading-6 font-normal font-clarys rounded-[48px] bg-card-panel bg-backgroundOpac ',
    ` w-[${width}]`,
    ` backdrop-blur-[${blur}]`,
)}>*/
export default CardPanel;