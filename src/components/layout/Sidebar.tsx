/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  UniqueIdentifier,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import {
  HeartIcon as OutlineHeartIcon, PencilIcon,
  PlusCircleIcon,
  TrashIcon
} from "@heroicons/react/24/outline";
import { HeartIcon, StarIcon } from "@heroicons/react/24/solid";
import { Collection } from "@prisma/client";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  collectionsList,
  openCollectionModal,
  openSidebarAtom
} from "../../store";
import {
  messages,
  toastifyErrorStyles,
  toastifySuccessStyles
} from "../../utils/constants";
import { trpc } from "../../utils/trpc";
import ActiveLink from "./header/ActiveLink";
import SortableItem from "./SortableItem";

const Sidebar = () => {
  const [openSidebar, setOpenSidebar] = useAtom(openSidebarAtom);
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
          toast.success(messages.deleteCollection, {
            style: toastifySuccessStyles,
          });
          const newCollections = collections.filter(
            (item) => item.id !== showContextMenu.id
          );
          setCollections(newCollections);
          if (showContextMenu?.slug === router.query.slug)
            router.replace(`/collections`);
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
    if (!showContextMenu?.id) return;
    toggleIsFavouriteCollection.mutate(
      {
        id: showContextMenu.id,
        isFavourite: showContextMenu.isFavourite!,
      },
      {
        onSuccess: () => {
          toast.success(
            showContextMenu.isFavourite
              ? messages.unfavouriteCollection
              : messages.favouriteCollection,
            {
              style: toastifySuccessStyles,
            }
          );
          setCollections(collections.map(collection => {
            if(collection.id === showContextMenu.id) return {...collection, isFavourite: !showContextMenu.isFavourite}
            return collection
          }))
        },
        onError: () => {
          toast.error(messages.errorMessage, {
            style: toastifyErrorStyles,
          });
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
      className={` h-[calc(100vh_-_65px)] w-[85%] shadow-md md:w-[450px] lg:w-[30%] ${
        !openSidebar
          ? "absolute translate-x-[-100%]"
          : "absolute z-50 translate-x-[0] md:relative"
      } 
     transform overflow-y-visible bg-secondaryColorL  duration-150 ease-linear dark:bg-secondaryColor`}
    >
      <div
        className="max-h-[93vh] overflow-y-scroll md:pt-8 scrollbar-hide"
        ref={sidebarRef}
      >
          <ActiveLink
            href={`/`}
            activeClassName="bg-primaryColorL/60 dark:bg-gray-600"
          >
        <div className="md:hidden mb-3" onClick={() => setOpenSidebar(false)}>

            <h1 className="pl-5 py-4 text-2xl font-semibold text-textColorL dark:text-textColor/80">
              Dashboard
            </h1>
        </div>

          </ActiveLink>
        <div className="mb-5 flex items-center gap-3 pl-5 md:pl-8">
          <h1
            className="withHover text-2xl font-semibold text-textColorL dark:text-textColor/80"
            onClick={() => {router.push("/collections"); setOpenSidebar(false)}}
          >
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
            <PlusCircleIcon className="withHover h-7 w-7 text-textColorL dark:text-textColor/80" />
          </div>
        </div>
        {collections && collections.length > 0 ? (
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
                    activeClassName="bg-primaryColorL/60 dark:bg-gray-600"
                  >
                    <div
                      className="withHover flex items-center justify-between py-4 pl-5 pr-5 hover:bg-primaryColorL hover:dark:bg-gray-600 md:pl-8"
                      onContextMenu={(e) => {
                        e.preventDefault();
                        setShowContextMenu(item);
                        setPoints({ x: e.pageX, y: e.pageY - 80 });
                      }}
                    >
                      <div className="withHover flex items-center gap-3">
                        <div
                          className={` grid place-items-center rounded-md p-2 shadow-md`}
                          style={{ backgroundColor: `${item.color}` }}
                        >
                          {item.icon}
                        </div>
                        <span className="break-words text-lg font-semibold text-textColorL dark:text-textColor">
                          {item.title && item.title.length > 20
                            ? item.title.slice(0, 17) + "..."
                            : item.title}
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
        ) : (
          <p className="text-center text-lg text-gray-500">No collections</p>
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
           text-textColor/80 hover:bg-gray-600 hover:text-textColor"
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
