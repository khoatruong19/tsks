import { BookOpenIcon } from "@heroicons/react/24/solid";
import { useAtom } from "jotai";
import React from "react";
import { openSidebarAtom } from "../store";

const Sidebar = () => {
  const [openSidebar] = useAtom(openSidebarAtom);
  return (
    <div
      className={`h-[calc(100vh_-_65px)] min-w-[300px] ${
        !openSidebar ? "absolute translate-x-[-100%]" : "translate-x-[0]"
      } 
     transform overflow-y-auto bg-secondaryColor duration-150 ease-linear`}
    >
      <div className="pt-8">
        <h1 className="mb-5 pl-8 text-xl font-semibold text-textColor/80">
          Collections
        </h1>
        <div className="withHover flex items-center gap-3 bg-gray-600 py-4 pl-8">
          <div className="grid place-items-center rounded-md bg-slate-300 p-2">
            <BookOpenIcon className="h-5 w-5" />
          </div>
          <span className="font-semibold text-textColor">School</span>
        </div>
        <div className="withHover flex items-center gap-3 py-4 pl-8">
          <div className="grid place-items-center rounded-md bg-slate-300 p-2">
            <BookOpenIcon className="h-5 w-5" />
          </div>
          <span className="font-semibold text-textColor">School</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
