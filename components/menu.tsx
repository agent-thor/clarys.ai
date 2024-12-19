import { useState, useEffect, useRef } from "react";
import { signOut } from "next-auth/react";
import { useSidebar } from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { handleTourComplete, handleTourNeeded } from "@/components/tour-panel";

const Menu = ({ userName }: { userName: string }) => {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

  const menu1Ref = useRef<HTMLDivElement | null>(null);
  const menu2Ref = useRef<HTMLDivElement | null>(null);
  const submenuRef = useRef<HTMLDivElement | null>(null);

  const handleMenuClick = (menu: string) => {
    if (activeMenu === menu) {
      setIsSubMenuOpen(!isSubMenuOpen);
    } else {
      setActiveMenu(menu);
      setIsSubMenuOpen(true);
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (
      menu1Ref.current &&
      !menu1Ref.current.contains(e.target as Node) &&
      menu2Ref.current &&
      !menu2Ref.current.contains(e.target as Node) &&
      submenuRef.current &&
      !submenuRef.current.contains(e.target as Node)
    ) {
      setActiveMenu(null);
      setIsSubMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    signOut({
      redirectTo: "/",
    });
  };
  const { toggleSidebar } = useSidebar();

  const handleWhyClarys = () => {
    handleTourNeeded(true);
    handleTourComplete(false);
    setTimeout(() => {
      router.push("/");
      router.refresh();
    }, 100);
  };

  return (
    <>
      <div className="relative buttonShadow px-8 py-2 rounded-2xl flex flex-row gap-4">
        <div
          className="relative"
          ref={menu1Ref}
          onClick={() => handleMenuClick("menu1")}
        >
          <button className="flex items-center justify-center space-x-2 focus:outline-none py-2 px-8 gap-2 hover:underline">
            <span className="hidden sm:block text-[12px] leading-4">
              {userName}
            </span>
            <img src="/images/user.svg" alt="User" className="w-4 h-4" />
          </button>
          {activeMenu === "menu1" && isSubMenuOpen && (
            <div
              ref={submenuRef}
              className="absolute top-10 right-0 mt-2 bg-white text-[12px] leading-4 buttonShadow p-4 rounded-2xl min-w-[200px]"
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
        </div>
        <div
          className="relative"
          ref={menu2Ref}
          onClick={() => handleMenuClick("menu2")}
        >
          <button className="flex items-center justify-center space-x-2 focus:outline-none py-2 px-4 gap-2 w-[120px]  hover:underline">
            <span className="hidden sm:block text-[12px] leading-4">Menu</span>
            <img src="/images/menu.svg" alt="Menu" className="w-4 h-4" />
          </button>
          {activeMenu === "menu2" && isSubMenuOpen && (
            <div
              ref={submenuRef}
              className="absolute top-10 right-[-32px] mt-2 bg-white text-[12px] leading-4 buttonShadow p-4 rounded-2xl min-w-[180px]"
            >
              <ul className="py-1">
                <li
                  className="px-8 py-4 hover:underline cursor-pointer"
                  onClick={handleWhyClarys}
                >
                  Why Clarys.AI
                </li>
                <li className="px-8 py-4 text-disabled">All Data</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Menu;
