import type { NextPage } from "next";
import {
  EllipsisHorizontalIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
import CollectionCard from "../../components/collections/CollectionCard";
import MainLayout from "../../components/layout/MainLayout";
import { useEffect } from "react";
import Loading from "../../components/layout/Loading";
import { trpc } from "../../utils/trpc";
import Loader from "../../components/others/Loader";
import { useAtom } from "jotai";
import { collectionsList, openCollectionModal } from "../../store";
import { useQueryClient } from "@tanstack/react-query";
import Sidebar from "../../components/layout/Sidebar";
import { useMediaQuery } from "react-responsive";

const Collections: NextPage = () => {
  const { data, isLoading } =
    trpc.collection.getAllCollectionsWithStatus.useQuery();
  const deleteAllCollections = trpc.collection.deleteAll.useMutation();
  const [_, setOpenCollectionModal] = useAtom(openCollectionModal);
  const [collections, setCollections] = useAtom(collectionsList);
  const [viewMode, setViewMode] = useState<0 | 1>(1);
  const { status } = useSession();
  const router = useRouter();
  const qc = useQueryClient();
  const isDesktop = useMediaQuery({ minWidth: 1024 });

  const [openSetting, setOpenSetting] = useState(false);

  const favouriteCollections = data?.filter(
    (collection) => collection.isFavourite === true
  );

  const handleDeleteAllCollections = () => {
    deleteAllCollections.mutate(undefined, {
      onSuccess: () => {
        qc.invalidateQueries("collection.getAllCollections");
        setCollections([]);
      },
    });
  };

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  if (status === "loading") return <Loading />;
  return (
    <>
      <Head>
        <title>Collections</title>
      </Head>
      <MainLayout>
        {!isDesktop && <Sidebar />}
        <div className="h-[calc(100vh_-_65px)] w-full overflow-hidden">
          {isLoading ? (
            <Loader />
          ) : (
            <div className="mx-auto h-[100%] w-full max-w-3xl overflow-y-scroll  px-3 pb-10 scrollbar-hide md:px-4">
              <div className="pt-10">
                <div className="mb-6 flex flex-col gap-5 md:gap-12">
                  <div className="flex items-center justify-between text-textColorL dark:text-textColor">
                    <h3 className="text-3xl font-bold">Collections</h3>
                    <div
                      className="relative"
                      onClick={() => setOpenSetting((prev) => !prev)}
                    >
                      <EllipsisHorizontalIcon className="withHover h-8 w-8" />
                      {openSetting && (
                        <div className="absolute bottom-[-60px] right-0 z-50 w-[110px] overflow-hidden rounded-md bg-secondaryColorL shadow-lg dark:bg-secondaryColor">
                          <p
                            onClick={() =>
                              setOpenCollectionModal({
                                type: "ADD",
                              })
                            }
                            className="withHover flex items-center gap-1.5 py-1.5 px-2 text-sm hover:bg-dashboardSecondaryColorL hover:text-green-300 hover:dark:bg-zinc-400"
                          >
                            <span>
                              <PlusCircleIcon className="h-5 w-5" />
                            </span>
                            Add new
                          </p>
                          <p
                            onClick={handleDeleteAllCollections}
                            className="withHover flex items-center gap-1.5 px-2 pt-1.5 pb-1.5 text-sm hover:bg-dashboardSecondaryColorL hover:text-red-300 hover:dark:bg-zinc-400"
                          >
                            <span>
                              <TrashIcon className="h-5 w-5" />
                            </span>
                            Delete all
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-10 mb-5 flex items-center gap-4 md:mb-0">
                    <button
                      className={`${
                        viewMode === 0
                          ? "bg-dashboardSecondaryColorL dark:bg-dashboardSecondaryColor"
                          : "border-2 border-[#F2DEBA] bg-transparent shadow-md dark:border-secondaryColor"
                      } dashboardBtn`}
                      onClick={() => viewMode !== 0 && setViewMode(0)}
                    >
                      Favourites
                    </button>
                    <button
                      className={`${
                        viewMode === 1
                          ? "bg-dashboardSecondaryColorL dark:bg-dashboardSecondaryColor"
                          : "border-2 border-[#F2DEBA] bg-transparent shadow-md dark:border-secondaryColor"
                      } dashboardBtn`}
                      onClick={() => viewMode !== 1 && setViewMode(1)}
                    >
                      All Collections
                    </button>
                  </div>
                  {viewMode === 0 ? (
                    <div className="grid grid-cols-1 gap-x-3 gap-y-4 md:grid-cols-3 md:gap-4 ">
                      {favouriteCollections &&
                        favouriteCollections.map((collection) => (
                          <CollectionCard
                            collection={collection}
                            key={collection.id}
                          />
                        ))}

                      <div
                        className="withHover flex h-[105px] items-center justify-center rounded-3xl
border-[3px] border-secondaryColor text-3xl text-white/60"
                        onClick={() => setOpenCollectionModal({ type: "ADD" })}
                      >
                        +
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-x-3 gap-y-4 md:grid-cols-3 md:gap-4 ">
                      {data &&
                        data.map((collection) => (
                          <CollectionCard
                            collection={collection}
                            key={collection.id}
                          />
                        ))}

                      <div
                        className="withHover mx-auto flex h-[105px] w-[75%] items-center justify-center rounded-3xl border-[3px]
                       border-[#F2DEBA] text-3xl text-textColorL dark:border-secondaryColor dark:text-white/60 md:w-full"
                        onClick={() => setOpenCollectionModal({ type: "ADD" })}
                      >
                        +
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </MainLayout>
    </>
  );
};

export default Collections;
