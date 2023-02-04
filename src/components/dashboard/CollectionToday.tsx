import autoAnimate from "@formkit/auto-animate";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { BookOpenIcon } from "@heroicons/react/24/solid";
import { Collection, Task } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { trpc } from "../../utils/trpc";
import ChevronController from "../others/ChevronController";
import CollectionTodayTask from "./CollectionTodayTask";

interface IProps{
  collection: Partial<Collection> & {tasks: Partial<Task>[]}
}

const CollectionToday = ({collection}: IProps) => {
  const [showTasks, setShowTasks] = useState(true);
  const [tasks, setTasks] = useState<Partial<Task>[]>([])

  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter()
  const doneTask = trpc.task.toggleDone.useMutation()

  const reveal = () => setShowTasks((prev) => !prev);
  
  const navigateToCollection = () => router.push(`/collections/${collection.slug}`)

  const handleDoneTask = (id: string) => {
    const newTasks = tasks.filter(item => item.id !== id)
    doneTask.mutate({
      id,
      done: true
    }, {
      onSuccess:() => {
        setTasks(newTasks)
      }
    })
  }

  useEffect(() => {
    containerRef.current && autoAnimate(containerRef.current);
  }, [containerRef]);

  useEffect(() => {
    if(collection.tasks.length > 0) setTasks(collection.tasks)
  },[collection])

  return (
    <div className="w-full overflow-hidden rounded-2xl" ref={containerRef}>
      <div className="flex items-center justify-between border-b-[1px] border-black/20 bg-dashboardSecondaryColor/30 p-4">
        <div className="withHover flex items-center gap-3 ">
          <div
            className={`grid place-items-center rounded-md p-2`}
            onClick={reveal}
            style={{backgroundColor: collection?.color}}
          >
            {collection?.icon}
          </div>
          <span className="text-xl font-semibold text-textColor">{collection?.title}</span>
        </div>
        <ChevronController
          show={showTasks}
          clickHandler={() => setShowTasks((prev) => !prev)}
        />
      </div>
      {showTasks && (
        <div className="border-b border-dashboardSecondaryColor/50 bg-secondaryColor">
          {tasks && tasks.map(task => (
            <CollectionTodayTask borderColor={collection.color} doneTask={handleDoneTask} key={task.id} task={task} />
          ))}
        </div>
      )}

      <div onClick={navigateToCollection} className="group flex cursor-pointer items-center justify-center bg-secondaryColor p-4 hover:bg-secondaryColor/90">
        <div className="flex items-center justify-center gap-1  text-textColor/95">
          <p className="text-xl font-medium">Go to collection</p>

          <span className="mt-1 transform duration-150 ease-linear group-hover:translate-x-2">
            <ChevronRightIcon className="h-6 w-6" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default CollectionToday;
