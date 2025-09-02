"use client";

import Link from "next/link";
import Menu from "@/components/menu";
import { SidebarToggle } from "@/components/sidebar-toggle";

interface ChatHeaderProps {
  userName: string;
  onOpenUsageGuide?: () => void;
}

export function ChatHeader({ userName, onOpenUsageGuide }: ChatHeaderProps) {
  return (
    <div className="w-full flex justify-between items-center">
      <div className="flex items-center gap-3">
        <SidebarToggle />
        <Link className="flex items-center justify-center" href="/">
        <div className="relative group w-[206px] h-[41.14px] overflow-hidden">
          <div className="elem1 w-full h-full flex items-center justify-start text-white font-bold z-100">
            <img
              src="/images/logomark.svg"
              alt="Image 1"
              width="48px"
              className="block"
            />
          </div>
          <img
            src="/images/logotype.svg"
            alt="Sliding Image"
            className="absolute top-[13px] left-0 w-[120px] h-[14px] opacity-0 -translate-x-full group-hover:translate-x-[60px] group-hover:opacity-100 transition-all duration-500 ease-in-out z-0"
          />
        </div>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenUsageGuide}
          className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:underline transition-colors focus:outline-none"
        >
          Usage Guide
        </button>
        <Menu userName={userName} />
      </div>
    </div>
  );
}
