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
      sads
    </div>
  );
};

export default Sidebar;
