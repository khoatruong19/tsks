import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";
import Head from "next/head";
import { useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import Sidebar from "../../components/layout/Sidebar";

const CollectionDetail = () => {
  const [viewMode, setViewMode] = useState<0 | 1>(0);
  return (
    <>
      <Head>
        <title>School</title>
      </Head>
      <MainLayout>
        <div className="flex">
          <Sidebar />
          <div className="h-[calc(100vh_-_65px)] w-full overflow-hidden">
            <div className="mx-auto h-[100%] w-full max-w-3xl overflow-y-scroll  pb-10 scrollbar-hide">
              <div className="pt-10">
                <div className="mb-6 flex flex-col gap-12">
                  <div className="flex items-center justify-between  text-textColor">
                    <h3 className="text-3xl font-bold">Dashboard</h3>
                    <div>
                      <EllipsisHorizontalIcon className="withHover h-8 w-8" />
                    </div>
                  </div>
                  <h1 className="text-4xl font-bold leading-tight text-textColor">
                    Good morning, <br /> Khoa Truong
                  </h1>
                  <div className="flex items-center gap-4">
                    <button
                      className={`${
                        viewMode === 0
                          ? "bg-dashboardSecondaryColor"
                          : "border-2 border-secondaryColor bg-transparent shadow-md"
                      } dashboardBtn`}
                      onClick={() => viewMode !== 0 && setViewMode(0)}
                    >
                      Daily Overview
                    </button>
                    <button
                      className={`${
                        viewMode === 1
                          ? "bg-dashboardSecondaryColor"
                          : "border-2 border-secondaryColor bg-transparent shadow-md"
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
      </MainLayout>
    </>
  );
};

export default CollectionDetail;
