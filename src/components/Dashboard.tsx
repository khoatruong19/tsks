import { useAtom } from "jotai";
import React from "react";
import { openSidebarAtom } from "../store";
import Sidebar from "./Sidebar";

const Dashboard = () => {
  const [openSidebar] = useAtom(openSidebarAtom);
  return (
    <div className="flex">
      <Sidebar />
      <div className="h-[calc(100vh_-_65px)] w-full">asdhajsdh</div>
    </div>
  );
};

export default Dashboard;
