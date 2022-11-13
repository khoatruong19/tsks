import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { NextPage } from "next";
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
import { openCollectionModal } from "../../store";

const Collections: NextPage = () => {
  const { data, isLoading } =
    trpc.collection.getAllCollectionsWithStatus.useQuery();
  const [_, setOpenCollectionModal] = useAtom(openCollectionModal);
  const [viewMode, setViewMode] = useState<0 | 1>(0);
  const { status } = useSession();
  const router = useRouter();

  const favouriteCollections = data?.filter(
    (collection) => collection.isFavourite === true
  );

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
        <div className="h-[calc(100vh_-_65px)] w-full overflow-hidden">
          {isLoading ? (
            <Loader />
          ) : (
            <div className="mx-auto h-[100%] w-full max-w-3xl overflow-y-scroll  px-2 pb-10 scrollbar-hide md:px-0">
              <div className="pt-10">
                <div className="mb-6 flex flex-col gap-5 md:gap-12">
                  <div className="flex items-center justify-between  text-textColor">
                    <h3 className="text-3xl font-bold">Collections</h3>
                    <div>
                      <EllipsisHorizontalIcon className="withHover h-8 w-8" />
                    </div>
                  </div>

                  <div className="mt-10 mb-5 flex items-center gap-4 md:mb-0">
                    <button
                      className={`${
                        viewMode === 0
                          ? "bg-dashboardSecondaryColor"
                          : "border-2 border-secondaryColor bg-transparent shadow-md"
                      } dashboardBtn`}
                      onClick={() => viewMode !== 0 && setViewMode(0)}
                    >
                      Favourites
                    </button>
                    <button
                      className={`${
                        viewMode === 1
                          ? "bg-dashboardSecondaryColor"
                          : "border-2 border-secondaryColor bg-transparent shadow-md"
                      } dashboardBtn`}
                      onClick={() => viewMode !== 1 && setViewMode(1)}
                    >
                      All Collections
                    </button>
                  </div>
                  {viewMode === 0 ? (
                    <div className="grid grid-cols-2 gap-x-3 gap-y-4 md:grid-cols-3 md:gap-4 ">
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
                    <div className="grid grid-cols-2 gap-x-3 gap-y-4 md:grid-cols-3 md:gap-4 ">
                      {data &&
                        data.map((collection) => (
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
