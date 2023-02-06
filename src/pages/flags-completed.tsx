import Head from "next/head";
import React from "react";
import MainLayout from "../components/layout/MainLayout";
import Loader from "../components/others/Loader";
import TodoTaskCard from "../components/task/TodoTaskCard";
import { trpc } from "../utils/trpc";

const FlagsCompleted = () => {
  const { data, isLoading } = trpc.task.getDoneFlagTasksInThisWeek.useQuery();

  return (
    <>
      <Head>
        <title>Weekly goal tasks completed</title>
      </Head>
      <MainLayout>
        <div className="h-[calc(100vh_-_65px)] w-full overflow-hidden">
          {isLoading ? (
            <Loader />
          ) : (
            <div className="mx-auto h-[100%] w-full max-w-3xl overflow-y-scroll  px-2 pb-10 scrollbar-hide md:px-0">
              <div className="pt-10">
                <div className="mb-6 flex flex-col gap-5 md:gap-12">
                  <h3 className="text-3xl font-bold text-textColorL dark:text-white">
                    Weekly goal tasks completed
                  </h3>
                </div>
                <div className="flex flex-col gap-1">
                  {data && data.length === 0 && (
                    <h2 className="mt-10 text-center text-lg font-semibold text-tertiaryColorL dark:text-white/60">
                      No completed tasks
                    </h2>
                  )}
                  {data &&
                    data.map((task) => (
                      <TodoTaskCard
                        show
                        key={task.id}
                        task={task}
                        deleteTask={() => {}}
                      />
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </MainLayout>
    </>
  );
};

export default FlagsCompleted;
