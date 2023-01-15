import {
  ChevronLeftIcon,
  EllipsisHorizontalIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";
import { useAtom } from "jotai";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import CompletedTasksContainer from "../../components/task/CompletedTasksContainer";
import TodoTasksContainer from "../../components/task/TodoTasksContainer";
import MainLayout from "../../components/layout/MainLayout";
import Sidebar from "../../components/layout/Sidebar";
import { openTaskModal } from "../../store";
import { useEffect, useMemo, useRef } from "react";
import Loading from "../../components/layout/Loading";
import { trpc } from "../../utils/trpc";
import ClipLoader from "react-spinners/ClipLoader";
import Loader from "../../components/others/Loader";
import { Task } from "@prisma/client";

const CollectionDetail = () => {
  const router = useRouter();
  const { data, isLoading } = trpc.collection.getCollectionBySlug.useQuery(
    {
      slug: router.query.slug as string,
    },
    {
      enabled: router.query.slug ? true : false,
    }
  );
  const [_, setOpenModal] = useAtom(openTaskModal);
  const { status } = useSession();
  const containerRef = useRef<HTMLDivElement>(null);

  const completedTasks = useMemo<Task[]>(() => {
    let tasks = [] as Task[];
    if (data?.tasks) {
      tasks = data.tasks.filter((task) => task.done === true);
    }
    return tasks;
  }, [data]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (containerRef.current)
      containerRef.current.scrollTo({ top: 0, behavior: "smooth" });
  }, [router]);

  if (status === "loading") return <Loading />;

  return (
    <>
      <Head>
        <title>{data?.title || ""}</title>
      </Head>
      <MainLayout>
        <div className="flex">
          <Sidebar />
          <div className="h-[calc(100vh_-_65px)] w-full overflow-hidden">
            <div
              ref={containerRef}
              className="mx-auto h-[100%] w-full max-w-3xl overflow-y-scroll  pb-10 scrollbar-hide"
            >
              {isLoading ? (
                <Loader />
              ) : (
                <div className="pt-10">
                  <div className="mb-6 flex flex-col gap-12 overflow-hidden">
                    <div className="flex items-center justify-between  text-textColor">
                      <div className="flex items-center gap-4">
                        <div
                          className="withHover rounded-lg bg-secondaryColor p-3"
                          onClick={() => router.back()}
                        >
                          <ChevronLeftIcon className="h-6 w-6 text-textColor" />
                        </div>
                        <h3 className="text-3xl font-bold">{data?.title}</h3>
                      </div>
                      <div>
                        <EllipsisHorizontalIcon className="withHover h-8 w-8" />
                      </div>
                    </div>

                    <div
                      className="withHover flex w-full items-center gap-3 rounded-2xl border-[1px] border-secondaryColor/80
                   p-3"
                      onClick={() => setOpenModal({ type: "ADD" })}
                    >
                      <div className="w-fit rounded-lg bg-tertiaryColor p-2">
                        <PlusIcon className="h-5 w-5 text-textColor" />
                      </div>
                      <p className="text-lg font-medium text-white/60">
                        Add a task
                      </p>
                    </div>

                    <TodoTasksContainer tasks={data ? data.tasks : []} />
                    <CompletedTasksContainer tasks={completedTasks} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </MainLayout>
    </>
  );
};

export default CollectionDetail;
