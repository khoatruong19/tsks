import { useState } from "react";
import Sidebar from "./layout/Sidebar";

const Dashboard = () => {
  const [viewMode, setViewMode] = useState<0 | 1>(0);
  return (
    <div className="flex">
      <Sidebar />
      <div className="h-[calc(100vh_-_65px)] w-full">
        <div className="mx-auto w-full max-w-3xl">
          <div className="pt-10">
            <div className="flex flex-col gap-12">
              <h3 className="text-2xl font-bold text-textColor">Dashboard</h3>
              <h1 className="text-4xl font-bold leading-tight text-textColor">
                Good morning, <br /> Khoa Truong
              </h1>
              <div className="flex items-center gap-4">
                <button
                  className={`${
                    viewMode === 0
                      ? "bg-dashboardSecondaryColor"
                      : "border-2 border-secondaryColor bg-transparent"
                  } dashboardBtn`}
                  onClick={() => viewMode !== 0 && setViewMode(0)}
                >
                  Daily Overview
                </button>
                <button
                  className={`${
                    viewMode === 1
                      ? "bg-dashboardSecondaryColor"
                      : "border-2 border-secondaryColor bg-transparent"
                  } dashboardBtn`}
                  onClick={() => viewMode !== 1 && setViewMode(1)}
                >
                  Statistic
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
