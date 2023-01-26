import {
  ChevronLeftIcon,
  EllipsisHorizontalIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";
import { Task } from "@prisma/client";
import { useAtom } from "jotai";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";
import Loading from "../../components/layout/Loading";
import MainLayout from "../../components/layout/MainLayout";
import Sidebar from "../../components/layout/Sidebar";
import Loader from "../../components/others/Loader";
import CompletedTasksContainer from "../../components/task/CompletedTasksContainer";
import TodoTasksContainer from "../../components/task/TodoTasksContainer";
import {
  collectionsList,
  openCollectionModal,
  openTaskModal,
} from "../../store";
import { trpc } from "../../utils/trpc";

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
  const deleteCollection = trpc.collection.delete.useMutation();
  const toggleIsFavouriteCollection =
    trpc.collection.toggleIsFavourite.useMutation();

  const [_, setOpenModal] = useAtom(openTaskModal);
  const [collections, setCollections] = useAtom(collectionsList);
  const [__, setOpenCollectionModal] = useAtom(openCollectionModal);
  const { status } = useSession();
  const containerRef = useRef<HTMLDivElement>(null);
  const [openSetting, setOpenSetting] = useState(false);
  const [isFavourite, setIsFavourite] = useState(false)

  const completedTasks = useMemo<Task[]>(() => {
    let tasks = [] as Task[];
    if (data?.tasks) {
      tasks = data.tasks.filter((task) => task.done === true && !task.parentId);
    }
    return tasks;
  }, [data]);

  const todoTasks = useMemo<Task[]>(() => {
    let tasks = [] as Task[];
    if (data?.tasks) {
      tasks = data.tasks.filter((task) => task.done !== true && !task.parentId);
    }
    return tasks;
  }, [data]);

  const handleDeleteCollection = () => {
    deleteCollection.mutate(
      {
        id: data?.id!,
        collections: collections.filter(
          (collection) => collection.id !== data?.id!
        ) as { id: string }[],
      },
      {
        onSuccess: () => {
          const newCollections = collections.filter(
            (item) => item.id !== data?.id!
          );
          setCollections(newCollections);
          if (router.query.slug === router.query.slug)
            router.push(`/collections`);
        },
      }
    );
  };

  const handleToggleIsFavourite = () => {
    if (!data?.id) return;
    toggleIsFavouriteCollection.mutate(
      {
        id: data.id,
        isFavourite: isFavourite!,
      },
      {
        onSuccess: () => {
          setCollections(
            collections.map((item) => {
              if (item.id === data.id)
                return { ...data, isFavourite: !isFavourite };
              return item;
            })
            );
          setIsFavourite(prev => !prev)
        },
      }
    );
  };

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (containerRef.current)
      containerRef.current.scrollTo({ top: 0, behavior: "smooth" });
  }, [router]);

  useEffect(() => {
    if(data?.isFavourite) setIsFavourite(data?.isFavourite)
  }, [data]);

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
                      <div
                        className="relative"
                        onClick={() => setOpenSetting((prev) => !prev)}
                      >
                        <EllipsisHorizontalIcon className="withHover h-8 w-8" />
                        {openSetting && (
                          <div className="absolute bottom-[-90px] right-0 z-50 w-[100px] overflow-hidden rounded-md bg-secondaryColor shadow-lg">
                            <p
                              onClick={handleToggleIsFavourite}
                              className="withHover py-1 px-2 hover:bg-zinc-400 hover:text-pink-300"
                            >
                              {isFavourite ? "Unfavourite" : "Favourite"}
                            </p>
                            <p
                              onClick={() =>
                                setOpenCollectionModal({
                                  type: "UPDATE",
                                  collection: data!,
                                })
                              }
                              className="withHover py-1 px-2 hover:bg-zinc-400 hover:text-amber-300"
                            >
                              Edit
                            </p>
                            <p
                              onClick={handleDeleteCollection}
                              className="withHover py-1 px-2 hover:bg-zinc-400 hover:text-red-300"
                            >
                              Delete
                            </p>
                          </div>
                        )}
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

                    <TodoTasksContainer tasks={todoTasks} />
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
