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
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { BookOpenIcon } from "@heroicons/react/24/solid";
import { Collection } from "@prisma/client";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { openCollectionModal, openSidebarAtom } from "../../store";
import { trpc } from "../../utils/trpc";
import ActiveLink from "./header/ActiveLink";
import SortableItem from "./SortableItem";

const color = "#00579B";

const Sidebar = () => {
  const [openSidebar] = useAtom(openSidebarAtom);
  const [_, setOpenCollectionModal] = useAtom(openCollectionModal);
  const { data, isLoading } = trpc.collection.getAllCollections.useQuery();
  const [collections, setCollections] = useState<Partial<Collection>[]>([]);

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
      setCollections((items: Partial<Collection>[]) => {
        const activeIndex = items.findIndex((item) => item.id === active.id);
        const overIndex = items.findIndex((item) => item.id === over?.id);
        return arrayMove(items, activeIndex, overIndex);
      });
    }
  };

  useEffect(() => {
    if (data) setCollections(data);
  }, [data, isLoading]);

  return (
    <div
      className={`h-[calc(100vh_-_65px)] min-w-[300px] ${
        !openSidebar ? "absolute translate-x-[-100%]" : "translate-x-[0]"
      } 
     transform overflow-y-auto bg-secondaryColor duration-150 ease-linear`}
    >
      <div className="pt-8">
        <div className="mb-5 flex items-center gap-3 pl-8">
          <h1 className="text-2xl font-semibold text-textColor/80">
            Collections
          </h1>
          <div className="pt-0.5" onClick={() => setOpenCollectionModal("Add")}>
            <PlusCircleIcon className="withHover h-7 w-7 text-textColor/80" />
          </div>
        </div>
        {collections && (
          <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
            <SortableContext
              items={collections.map((item) => {
                return { id: item.id as UniqueIdentifier };
              })}
              strategy={verticalListSortingStrategy}
            >
              {collections.map((item) => (
                <SortableItem key={item.id} id={item.id!}>
                  <ActiveLink
                    href={`/collections/${item.slug}`}
                    activeClassName="bg-gray-600"
                  >
                    <div className="withHover flex items-center gap-3  py-4 pl-8">
                      <div
                        className={` grid place-items-center rounded-md p-2`}
                        style={{ backgroundColor: `${color}` }}
                      >
                        🎧
                      </div>
                      <span className="text-lg font-semibold text-textColor">
                        {item.title}
                      </span>
                    </div>
                  </ActiveLink>
                </SortableItem>
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
