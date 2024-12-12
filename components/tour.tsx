"use client";

import { ChatHeader } from "@/components/chat-header";
import TourPanel from "@/components/tour-panel";
import CardPanel from "@/components/ui/card-panel";

export function Tour({
  userName,
  tourNeeded,
}: {
  userName: string;
  tourNeeded: boolean;
}) {
  return (
    <>
      <div className="flex flex-row flex-1 align-middle justify-center py-16 h-full gap-16">
        <CardPanel fullWidth={true}>
          <ChatHeader userName={userName} />
          <div className="flex flex-col gap-4 pt-8">
            <div className="font-clarys leading-[80px] font-bold text-greetingMedium text-left">
              Welcome to <span className="text-gradient">Clarys.AI </span>
            </div>
          </div>
          <TourPanel tourNeeded={tourNeeded}></TourPanel>
        </CardPanel>
      </div>
    </>
  );
}
