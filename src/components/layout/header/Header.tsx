import { SunIcon } from "@heroicons/react/24/outline";
import {
  Bars3Icon,
  ClipboardDocumentIcon,
  MagnifyingGlassIcon,
  MoonIcon,
  PlusIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/solid";
import { useAtom } from "jotai";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { openSidebarAtom, openTaskModal, themeMode } from "../../../store";
import ActiveLink from "./ActiveLink";
import SearchInput from "./SearchInput";

interface IProps {
  hasSidebar: boolean;
}

const Header = ({ hasSidebar }: IProps) => {
  const [openSidebar, setOpenSidebar] = useAtom(openSidebarAtom);
  const [_, setOpenModal] = useAtom(openTaskModal);
  const [openLogout, setOpenLogout] = useState(false);
  const { data } = useSession();
  const router = useRouter();
  const [theme, setTheme] = useAtom(themeMode);

  const [openSearch, setOpenSearch] = useState(false);

  const handleToggleTheme = () => {
    if (localStorage.theme === "dark") {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setTheme("light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setTheme("dark");
    }
  };

  const handleLogout = () => {
    router.replace("/login");
    signOut();
  };
  return (
    <div className="w-full border-b-[1px] border-black/20 bg-secondaryColorL dark:bg-secondaryColor">
      <div className="flex items-center justify-between px-3 lg:px-6  h-16">
        <div className="flex items-center md:gap-2 lg:gap-4 xl:gap-6 mr-2">
          {hasSidebar && (
            <div onClick={() => setOpenSidebar(!openSidebar)}>
              <Bars3Icon className="withHover h-7 w-7 text-textColorL dark:text-textColor" />
            </div>
          )}
          <div className="hidden md:flex items-center md:gap-2 lg:gap-4 xl:gap-6">
            <ActiveLink
              activeClassName="text-textColorL dark:text-textColor"
              href="/"
            >
              <div className="flex cursor-pointer items-center gap-1 lg:gap-2 ">
                <Squares2X2Icon className="h-7 w-7" />
                <span className="font-medium">Dashboard</span>
              </div>
            </ActiveLink>
            <ActiveLink
              href="/collections"
              activeClassName="text-textColorL dark:text-textColor"
            >
              <div className="flex cursor-pointer items-center gap-1 lg:gap-2">
                <ClipboardDocumentIcon className="h-7 w-7" />
                <span className="font-medium ">Collections</span>
              </div>
            </ActiveLink>
          </div>
        </div>

        <div className="flex items-center ml-auto gap-3 lg:gap-4 xl:gap-5 text-textColorL dark:text-textColor">
          <div
            className="withHover gradientBgColor grid h-7 w-7 place-items-center rounded-md shadow-md"
            onClick={() => setOpenModal({ type: "ADD" })}
          >
            <PlusIcon className="h-5 w-5 text-secondaryColorL" />
          </div>
          <SearchInput openSearch={openSearch} setOpenSearch={setOpenSearch} />
          <div onClick={handleToggleTheme} className="withHover ">
            {theme === "light" ? (
              <MoonIcon className="h-6 w-6  text-gray-500" />
            ) : (
              <SunIcon className="h-6 w-6 text-[#FAD6A5]" />
            )}
          </div>
          <div className="relative">
            <div
              className="withHover relative h-8 w-8 overflow-hidden rounded-full"
              onClick={() => setOpenLogout((prev) => !prev)}
            >
              <Image alt="avatar" src={data?.user?.image || ""} fill />
            </div>
            {openLogout && (
              <div
                className="withHover absolute left-[-45px] bottom-[-45px] z-[999] rounded-md bg-white px-3 py-2 
            font-semibold text-primaryColor shadow-lg"
                onClick={handleLogout}
              >
                Logout
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
