import {
  ChevronLeftIcon,
  EllipsisHorizontalIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";
import Head from "next/head";
import CompletedTasksContainer from "../../components/collections/CompletedTasksContainer";
import TodoTasksContainer from "../../components/collections/TodoTasksContainer";
import MainLayout from "../../components/layout/MainLayout";
import Sidebar from "../../components/layout/Sidebar";

const CollectionDetail = () => {
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
                <div className="mb-6 flex flex-col gap-12 overflow-hidden">
                  <div className="flex items-center justify-between  text-textColor">
                    <div className="flex items-center gap-4">
                      <div className="withHover rounded-lg bg-secondaryColor p-3">
                        <ChevronLeftIcon className="h-6 w-6 text-textColor" />
                      </div>
                      <h3 className="text-3xl font-bold">School</h3>
                    </div>
                    <div>
                      <EllipsisHorizontalIcon className="withHover h-8 w-8" />
                    </div>
                  </div>

                  <div className="withHover flex w-full items-center gap-3 rounded-2xl border-[1px] border-secondaryColor/80 p-3">
                    <div className="w-fit rounded-lg bg-tertiaryColor p-2">
                      <PlusIcon className="h-5 w-5 text-textColor" />
                    </div>
                    <p className="text-lg font-medium text-white/60">
                      Add a task
                    </p>
                  </div>

                  <TodoTasksContainer />
                  <CompletedTasksContainer />
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
