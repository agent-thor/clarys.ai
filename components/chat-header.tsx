"use client";

import { useSidebar } from "./ui/sidebar";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { saveTourCompleted } from "@/app/(chat)/actions";
import { useRouter } from "next/navigation";

export function ChatHeader({ userName }: { userName: string }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [menu2Open, setMenu2Open] = useState(false);

  const handleMenu1Click = () => {
    setMenuOpen(!menuOpen);
    setMenu2Open(false);
  };
  const handleMenu2Click = () => {
    setMenuOpen(false);
    setMenu2Open(!menu2Open);
  };
  const handleLogout = () => {
    signOut({
      redirectTo: "/",
    });
  };

  const handleWhyClarys = () => {
    saveTourCompleted(false);
    setTimeout(() => {
      router.push("/");
    }, 500);
  };

  // const onClickOutside = () => {
  //     setMenuOpen(false);
  //     setMenu2Open(false);
  // }

  const { toggleSidebar } = useSidebar();

  return (
    <div className="w-full flex justify-between items-center">
      <Link className="flex items-center justify-center" href="/">
        <img
          src="/images/logomark.svg"
          alt="Image 1"
          width="48px"
          className="block"
        />

        <motion.img
          src="/images/logotype.svg"
          width="120px"
          alt="Image 2"
          className="relative top-0 left-0"
          initial={{ opacity: 0, x: -50 }} // Hidden and off-screen left
          whileHover={{ opacity: 1, x: 0 }} // Slides in and becomes visible
          transition={{ duration: 0.5, ease: "linear" }}
        />
      </Link>

      <div className="relative buttonShadow px-8 py-2 rounded-2xl flex flex-row gap-4">
        {/* onBlur={onClickOutside}*/}
        <button
          className="flex items-center justify-center space-x-2 focus:outline-none py-2 px-8 gap-2 hover:underline"
          onClick={handleMenu1Click}
        >
          <span className="hidden sm:block text-[12px] leading-4">
            {userName}
          </span>
          <img src="/images/user.svg" alt="User" className="w-4 h-4" />
        </button>
        <button
          className="flex items-center justify-center space-x-2 focus:outline-none py-2 px-4 gap-2 w-[120px]  hover:underline"
          onClick={handleMenu2Click}
        >
          <span className="hidden sm:block text-[12px] leading-4">Menu</span>
          <img src="/images/menu.svg" alt="Menu" className="w-4 h-4" />
        </button>

        {/* Dropdown Menu for User*/}
        {menuOpen && (
          <div
            className="absolute top-12 right-[168px] mt-2 bg-white text-[12px] leading-4 buttonShadow p-4 rounded-2xl"
            onClick={handleMenu1Click}
          >
            <ul className="py-1">
              <li
                className="px-8 py-4 hover:underline cursor-pointer"
                onClick={handleLogout}
              >
                Logout
              </li>
              <li className="px-8 py-4 text-disabled">Connect Wallet</li>
              <li
                className="px-8 py-4 hover:underline cursor-pointer"
                onClick={toggleSidebar}
              >
                See Last Queries
              </li>
            </ul>
          </div>
        )}
        {/* Dropdown Menu for Menu*/}
        {menu2Open && (
          <div
            className="absolute top-12 right-0 mt-2 bg-white text-[12px] leading-4 buttonShadow p-4 rounded-2xl"
            onClick={handleMenu2Click}
          >
            <ul className="py-1">
              <li
                className="px-8 py-4 hover:underline cursor-pointer hover:underline cursor-pointer"
                onClick={handleWhyClarys}
              >
                Why Clarys.AI
              </li>
              <li className="px-8 py-4 hover:underline cursor-pointer text-disabled">
                All Data
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
