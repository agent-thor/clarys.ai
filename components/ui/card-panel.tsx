'use client'

import {ReactNode} from "react";
import Footer from "@/components/footer";
import {cn} from "@/lib/utils";

interface CardPanelProps {
    children: ReactNode; // This allows a component to be passed as children
    fullWidth?: boolean;
    blur?: string;
}

const CardPanel: React.FC<CardPanelProps> = ({children, fullWidth = false, blur = '32px'}) => {
    let classes = 'flex flex-col p-16 gap-8 text-sm leading-6 font-normal font-clarys rounded-[48px] bg-card-panel bg-backgroundOpac max-w-[1280px] h-full';
    classes += ` backdrop-blur-[${blur}]`;
    classes += fullWidth ? ' w-fullCard' : ' w-card';

    return (
        <div className={classes}>
            {children}
            <Footer></Footer>
        </div>
    );

    // return (
    //     <div className={cn(
    //         'flex flex-col p-16 gap-8 text-sm leading-6 font-normal font-clarys rounded-[48px] bg-card-panel bg-backgroundOpac max-w-[1280px]',
    //         ` w-[${width}]`,
    //         ` backdrop-blur-[${blur}]`,
    //     )}>
    //         {children}
    //         <Footer></Footer>
    //     </div>
    // );
}
export default CardPanel;