import {
  DndContext,
  DragEndEvent,
  PointerSensor,
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
import { useAtom } from "jotai";
import { useState } from "react";
import { openSidebarAtom } from "../../store";
import ActiveLink from "./header/ActiveLink";
import SortableItem from "./SortableItem";

const color = "#00579B";

const Sidebar = () => {
  const [openSidebar] = useAtom(openSidebarAtom);
  const [links, setLinks] = useState(["School", "Gaming"]);

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
      setLinks((items: string[]) => {
        const activeIndex = items.indexOf(active.id as string);
        const overIndex = items.indexOf(over?.id as string);
        return arrayMove(items, activeIndex, overIndex);
      });
    }
  };

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
          <div className="pt-0.5">
            <PlusCircleIcon className="withHover h-7 w-7 text-textColor/80" />
          </div>
        </div>
        <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
          <SortableContext items={links} strategy={verticalListSortingStrategy}>
            {links.map((item) => (
              <SortableItem key={item} id={item}>
                <ActiveLink
                  href={`/collections/${item.toLocaleLowerCase().trim()}`}
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
                      {item}
                    </span>
                  </div>
                </ActiveLink>
              </SortableItem>
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export default Sidebar;
