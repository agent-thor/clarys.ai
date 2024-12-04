'use client'

import {useOverlay} from "@/components/OverlayPanel/OverlayContext";


interface FooterProps {
    singleRow?: boolean;
}

const Footer: React.FC<FooterProps> = ({singleRow = true}) =>  {

    const {openOverlay} = useOverlay();
    /*todo overlay*/

    const termsConditionsPrivacy = <div className="justify-center items-center gap-4 inline-flex">
        <div className="rounded-2xl justify-center items-center gap-2 flex leading-3">
            <div
                // onClick={openOverlay}
                className="text-center text-primary text-[12px] font-normal font-clarys leading-3 cursor-pointer">Terms
                & Conditions
            </div>
        </div>
        <div className="rounded-2xl justify-center items-center gap-2 flex leading-3">
            <div
                // onClick={openOverlay}
                className="text-center text-primary text-[12px] font-normal font-clarys leading-3 cursor-pointer">Privacy
                Policy
            </div>
        </div>
    </div>;

    const copyright = <div className="text-center text-primary text-[12px] font-normal font-['Open Sans'] leading-3">Copyright
        ©2024 Clarys.AI. All rights reserved.
    </div>;

    return (
        <>
            { !singleRow && <div className="self-stretch flex-col justify-start items-center gap-4 flex leading-3">
                {termsConditionsPrivacy}
                {copyright}
            </div>}
            {
                singleRow && <div className="self-stretch flex-row justify-between items-center gap-4 flex leading-3">
                    {copyright}
                    {termsConditionsPrivacy}
                </div>
            }
        </>
    );
};
export default Footer;
