"use client";

import CardPanel from "@/components/ui/card-panel";
import { ChatHeader } from "@/components/chat-header";
import React from "react";
import TourPanel from "@/components/step-panel";

export function Tour({ userName, tourNeeded}: { userName: string, tourNeeded?: boolean }) {
  return (
    <>
      <div className="flex flex-row flex-1 align-middle justify-center py-16 h-full gap-16">
        <CardPanel fullWidth={true}>
          <div className="self-stretch grow shrink basis-0 flex-col justify-start items-start gap-16 flex">
            <ChatHeader userName={userName} />
            <div className="flex flex-col gap-4">
              <div className="font-clarys leading-[80px] font-bold text-greetingMedium text-left">
                Welcome to <span className="text-gradient">Clarys.AI! </span>
              </div>
            </div>
            <TourPanel tourNeeded={tourNeeded}></TourPanel>
          </div>
        </CardPanel>
      </div>
    </>
  );
}
