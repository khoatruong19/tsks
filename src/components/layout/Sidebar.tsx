/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  PencilIcon,
  PlusCircleIcon,
  TrashIcon,
  HeartIcon as OutlineHeartIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon, StarIcon } from "@heroicons/react/24/solid";
import { Collection } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import {
  collectionsList,
  openCollectionModal,
  openSidebarAtom,
} from "../../store";
import { trpc } from "../../utils/trpc";
import ActiveLink from "./header/ActiveLink";
import SortableItem from "./SortableItem";

const Sidebar = () => {
  const [openSidebar] = useAtom(openSidebarAtom);
  const [_, setOpenCollectionModal] = useAtom(openCollectionModal);
  const { data, isLoading } = trpc.collection.getAllCollections.useQuery(
    undefined,
    {
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );
  const { mutate } = trpc.collection.updatePosition.useMutation();
  const deleteCollection = trpc.collection.delete.useMutation();
  const toggleIsFavouriteCollection =
    trpc.collection.toggleIsFavourite.useMutation();
  const qc = useQueryClient();
  const router = useRouter();
  const [collections, setCollections] = useAtom(collectionsList);
  const [showContextMenu, setShowContextMenu] =
    useState<null | Partial<Collection>>(null);
  const [points, setPoints] = useState({ x: 0, y: 0 });
  const sidebarRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event; 
    if (active.id !== over?.id) {
      const activeCollection = collections.find(
        (item) => item.id === active.id
      );
      const overCollection = collections.find((item) => item.id === over?.id);
      setCollections((items: Partial<Collection>[]) => {
        const activeIndex = items.findIndex((item) => item.id === active.id);
        const overIndex = items.findIndex((item) => item.id === over?.id);
        return arrayMove(items, activeIndex, overIndex);
      });
      if (activeCollection && overCollection) {
        mutate({
          activeId: active.id as string,
          overId: over?.id as string,
          activePos: activeCollection?.position!,
          overPos: overCollection?.position!,
        });
      }
    }
  };

  const handleDeleteCollection = () => {
    if (!showContextMenu?.id) return;
    deleteCollection.mutate(
      {
        id: showContextMenu.id,
        collections: collections.filter(
          (collection) => collection.id !== showContextMenu.id
        ) as { id: string }[],
      },
      {
        onSuccess: () => {
          const newCollections = collections.filter(item => item.id !== showContextMenu.id)
          setCollections(newCollections)
          if (showContextMenu?.slug === router.query.slug)
            router.replace(`/collections`);
        },
      }
    );
  };

  const handleToggleIsFavourite = () => {
    if (!showContextMenu?.id) return;
    toggleIsFavouriteCollection.mutate(
      {
        id: showContextMenu.id,
        isFavourite: showContextMenu.isFavourite!,
      },
      {
        onSuccess: () => {
          qc.invalidateQueries("collection.getAllCollections");
        },
      }
    );
  };

  useEffect(() => {
    if (data) setCollections(data);
  }, [data, isLoading]);

  useEffect(() => {
    const handleCloseContextMenu = () => setShowContextMenu(null);
    if (typeof window !== undefined && sidebarRef.current) {
      window.addEventListener("click", handleCloseContextMenu);
      sidebarRef.current.addEventListener("scroll", handleCloseContextMenu);
      return () => {
        window.removeEventListener("click", handleCloseContextMenu);
        sidebarRef.current &&
          sidebarRef.current!.addEventListener(
            "scroll",
            () => handleCloseContextMenu
          );
      };
    }
  }, []);

  return (
    <div
      className={` h-[calc(100vh_-_65px)] min-w-[300px] ${
        !openSidebar
          ? "absolute translate-x-[-100%]"
          : "absolute md:relative translate-x-[0] z-50"
      } 
     transform overflow-y-visible  bg-secondaryColor duration-150 ease-linear`}
    >
      <div
        className="max-h-[93vh] overflow-y-scroll pt-8 scrollbar-hide"
        ref={sidebarRef}
      >
        <div className="mb-5 flex items-center gap-3 pl-8">
          <h1 className="text-2xl font-semibold text-textColor/80">
            Collections
          </h1>
          <div
            className="pt-0.5"
            onClick={() =>
              setOpenCollectionModal({
                type: "ADD",
              })
            }
          >
            <PlusCircleIcon className="withHover h-7 w-7 text-textColor/80" />
          </div>
        </div>
        {collections && (
          <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
            <SortableContext
              items={collections.map((item) => {
                return { id: item?.id as UniqueIdentifier };
              })}
              strategy={verticalListSortingStrategy}
            >
              {collections.map((item) => (
                <SortableItem key={item.id} id={item.id!}>
                  <ActiveLink
                    href={`/collections/${item.slug}`}
                    activeClassName="bg-gray-600"
                  >
                    <div
                      className="withHover flex items-center justify-between py-4 pl-8 pr-5 hover:bg-gray-600"
                      onContextMenu={(e) => {
                        e.preventDefault();
                        setShowContextMenu(item);
                        setPoints({ x: e.pageX, y: e.pageY - 80 });
                      }}
                    >
                      <div className="withHover flex items-center gap-3">
                        <div
                          className={` grid place-items-center rounded-md p-2`}
                          style={{ backgroundColor: `${item.color}` }}
                        >
                          {item.icon}
                        </div>
                        <span className="text-lg font-semibold text-textColor">
                          {item.title}
                        </span>
                      </div>
                      {item.isFavourite && (
                        <div>
                          <StarIcon className="h-5 w-5 text-yellow-400" />
                        </div>
                      )}
                    </div>
                  </ActiveLink>
                </SortableItem>
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>
      {showContextMenu && (
        <div
          className="absolute z-[999] overflow-hidden rounded-md shadow-2xl"
          style={{
            top: points.y,
            left: points.x,
          }}
        >
          <div
            className="flex cursor-pointer items-center gap-2 bg-primaryColor px-3 py-1.5
           text-textColor/80  hover:bg-gray-600 hover:text-textColor"
            onClick={handleToggleIsFavourite}
          >
            {showContextMenu.isFavourite ? (
              <>
                <HeartIcon className="h-5 w-5" />
                <span>Unfavourite</span>
              </>
            ) : (
              <>
                <OutlineHeartIcon className="h-5 w-5" />
                <span>Favourite</span>
              </>
            )}
          </div>
          <div
            className="flex cursor-pointer items-center gap-2 bg-primaryColor px-3 py-1.5
           text-textColor/80  hover:bg-gray-600 hover:text-textColor"
            onClick={() =>
              setOpenCollectionModal({
                type: "UPDATE",
                collection: showContextMenu,
              })
            }
          >
            <PencilIcon className="h-5 w-5" />
            <span>Edit</span>
          </div>
          <div
            className="flex cursor-pointer items-center gap-2 bg-primaryColor px-3 py-1.5
            text-textColor/80  hover:bg-gray-600 hover:text-textColor"
            onClick={handleDeleteCollection}
          >
            <TrashIcon className="h-5 w-5" />
            <span>Delete</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
