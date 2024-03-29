import { HeartIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconS, StarIcon } from "@heroicons/react/24/solid";
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
import { toast } from "react-toastify";
import {
  messages,
  toastifyErrorStyles,
  toastifySuccessStyles,
} from "../../utils/constants";

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
  const [isFavourite, setIsFavourite] = useState(false);

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
          toast.success(messages.deleteCollection, {
            style: toastifySuccessStyles,
          });
          const newCollections = collections.filter(
            (item) => item.id !== data?.id!
          );
          setCollections(newCollections);

          if (router.query.slug === router.query.slug)
            router.push(`/collections`);
         
        },
        onError: () => {
          toast.success(messages.errorMessage, {
            style: toastifyErrorStyles,
          });
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
          toast.success(isFavourite ? messages.unfavouriteCollection : messages.favouriteCollection, {
            style: toastifySuccessStyles,
          });
          setCollections(
            collections.map((item) => {
              if (item.id === data.id)
                return { ...data, isFavourite: !isFavourite };
              return item;
            })
          );
          setIsFavourite((prev) => !prev);
        },
        onError: () => {
          toast.error(messages.errorMessage, {
            style: toastifyErrorStyles,
          });
        }
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
    if (data?.isFavourite) setIsFavourite(data?.isFavourite);
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
                <div className="pt-6 md:pt-10 px-3">
                  <div className="mb-6 flex flex-col gap-12 overflow-hidden">
                    <div className="flex flex-row  md:flex-row md:items-center justify-between  text-textColor">
                      <div className="flex md:items-center md:flex-row flex-col items-start gap-4">
                        <div
                          className="withHover rounded-lg bg-secondaryColorL dark:bg-secondaryColor p-3 shadow-md"
                          onClick={() => router.push("/collections")}
                        >
                          <ChevronLeftIcon className="h-6 w-6 text-textColorL dark:text-textColor" />
                        </div>
                        <h3 className=" text-textColorL dark:text-textColor gap-1 max-w-2xl break-all text-3xl font-bold">
                          {data?.title}
                          {isFavourite && (
                            <span className="ml-1">
                              ⭐
                            </span>
                          )}
                        </h3>
                      </div>
                      <div
                        className="absolute right-2 md:relative"
                        onClick={() => setOpenSetting((prev) => !prev)}
                      >
                        <EllipsisHorizontalIcon className="mt-2 text-textColorL dark:text-textColor withHover h-8 w-8  md:mt-0" />
                        {openSetting && (
                          <div className="absolute md:bottom-[-95px] text-textColorL dark:text-textColor right-0 z-50 w-[115px] overflow-hidden rounded-md bg-secondaryColorL dark:bg-secondaryColor shadow-lg">
                            <p
                              onClick={handleToggleIsFavourite}
                              className="withHover flex items-center gap-1.5 py-1.5 px-2 text-sm hover:bg-dashboardSecondaryColorL hover:dark:bg-zinc-400 hover:text-pink-300"
                            >
                              <span>
                                {!isFavourite ? (
                                  <HeartIcon className="h-5 w-5" />
                                ) : (
                                  <HeartIconS className="h-5 w-5" />
                                )}
                              </span>
                              {isFavourite ? "Unfavourite" : "Favourite"}
                            </p>
                            <p
                              onClick={() =>
                                setOpenCollectionModal({
                                  type: "UPDATE",
                                  collection: data!,
                                })
                              }
                              className="withHover flex items-center gap-1.5 py-1.5 px-2 text-sm hover:bg-dashboardSecondaryColorL hover:dark:bg-zinc-400 hover:text-amber-300"
                            >
                              <span>
                                <PencilIcon className="h-5 w-5" />
                              </span>
                              Edit
                            </p>
                            <p
                              onClick={handleDeleteCollection}
                              className="withHover flex items-center gap-1.5 px-2 pt-1.5 pb-1.5 text-sm hover:bg-dashboardSecondaryColorL hover:dark:bg-zinc-400 hover:text-red-300"
                            >
                              <span>
                                <TrashIcon className="h-5 w-5" />
                              </span>
                              Delete
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div
                      className="withHover flex w-full items-center gap-3 rounded-2xl border-[1px] border-[#F2DEBA] dark:border-secondaryColor/80
                   p-3"
                      onClick={() => setOpenModal({ type: "ADD" })}
                    >
                      <div className="w-fit rounded-lg bg-tertiaryColorL dark:bg-tertiaryColor p-2">
                        <PlusIcon className="h-5 w-5 text-textColor" />
                      </div>
                      <p className="text-lg font-medium text-textColorL/60 dark:text-white/60">
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
