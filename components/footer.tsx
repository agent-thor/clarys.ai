'use client'

import {useOverlay} from "@/components/OverlayPanel/OverlayContext";

export default function Footer() {

    const {openOverlay} = useOverlay();

    return (
        <>
            <div className="self-stretch h-10 flex-col justify-start items-center gap-4 flex">
                <div className="justify-center items-center gap-4 inline-flex">
                    <div className="rounded-2xl justify-center items-center gap-2 flex">
                        <div
                            onClick={openOverlay}
                            className="text-center text-primary text-xs font-normal font-clarys leading-3"
                            style={{fontSize: 12 + 'px'}}>Terms
                            & Conditions
                        </div>
                    </div>
                    <div className="rounded-2xl justify-center items-center gap-2 flex">
                        <div
                            onClick={openOverlay}
                            className="text-center text-primary text-xs font-normal font-clarys leading-3"
                            style={{fontSize: 12 + 'px'}}>Privacy
                            Policy
                        </div>
                    </div>
                </div>
                <div className="text-center text-primary text-xs font-normal font-['Open Sans'] leading-3"
                     style={{fontSize: 12 + 'px'}}>Copyright
                    ©2024 Clarys.AI. All rights reserved.
                </div>
            </div>
        </>
    )
};