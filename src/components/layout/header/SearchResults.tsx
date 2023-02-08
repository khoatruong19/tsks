import {
  CheckIcon,
  FlagIcon,
  ListBulletIcon,
} from "@heroicons/react/24/solid";
import { Collection, Task } from "@prisma/client";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import React, { memo, useMemo } from "react";
import { collectionsList, tasksList } from "../../../store";
import { formatTextLength } from "../../../utils/helpers";

interface IProps {
  keyword: string;
  closeSearch: () => void;
}

const SearchResults = ({ keyword, closeSearch }: IProps) => {
  const [collections, _] = useAtom(collectionsList);
  const [tasks, __] = useAtom(tasksList);
  const router = useRouter();
  
  const results = useMemo(() => {
    if (keyword.length > 0) {
      const foundCollections = collections.filter((item) =>
        item.title?.toLowerCase().includes(keyword.toLowerCase())
      );
      const foundTasks = tasks
        .sort((a, b) => b.children.length - a.children.length)
        .filter((item) =>
          item.content?.toLowerCase().includes(keyword.toLowerCase())
        );

      return { foundCollections, foundTasks };
    }
    return { foundCollections: [], foundTasks: [] };
  }, [keyword]);

  const handleClickSearchedItem = (slug = "") => {
    closeSearch();
    router.push(`/collections/${slug}`);
  };

  const __renderTask = (
    task: Task & { children: Task[]; collection: Partial<Collection> }
  ) => {
    if (task.children.length > 0) {
      return (
        <div
          className="flex cursor-pointer gap-1.5 p-2 hover:bg-secondaryColorL/30"
          onClick={() => handleClickSearchedItem(task.collection.slug)}
        >
          <span className="mt-1 h-5 w-5">
            <ListBulletIcon className="h-5 w-5" />
          </span>
          <div className="">
            <p className="font-semibold flex items-center gap-1">
              {formatTextLength(task.content, 45, true)}
              <span className="flex items-center gap-0.5">
                {task.flag && <FlagIcon className="h-4 w-4 text-red-300" />}
                {task.done && <CheckIcon className="w-4 h-4 text-blue-300" />}
              </span>
            </p>
            <div className="mt-1 flex items-center gap-1">
              <div
                className="flex h-6 w-6 items-center justify-center rounded-md"
                style={{ backgroundColor: task.collection.color }}
              >
                <p>{task.collection.icon}</p>
              </div>
              <p className="text-sm italic text-gray-200">
                {formatTextLength(task.collection.title, 50, true)}
              </p>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div
        onClick={() => handleClickSearchedItem(task.collection.slug)}
        className="flex cursor-pointer items-center justify-between gap-1 p-2 hover:bg-secondaryColorL/30"
      >
        <p className="flex items-center gap-1">
          {formatTextLength(task.content, 25,true)}
          <span className="flex items-center gap-0.5">
            {task.flag && <FlagIcon className="h-4 w-4 text-red-300" />}
            {task.done && <CheckIcon className="w-4 h-4 text-blue-300" />}
          </span>{" "}
        </p>
        <div className="mt-1 flex items-center gap-1">
          <div
            className="flex h-6 w-6 items-center justify-center rounded-md"
            style={{ backgroundColor: task.collection.color }}
          >
            <p>{task.collection.icon}</p>
          </div>
          <p className="text-sm italic text-gray-200">
            {formatTextLength(task.collection.title, 20,true)}
          </p>
        </div>
      </div>
    );
  };

  const __renderCollection = (collection: Partial<Collection>) => (
    <div
      onClick={() => handleClickSearchedItem(collection.slug)}
      className="flex cursor-pointer items-center p-2 hover:bg-secondaryColorL/30"
    >
      <div className="mt-1 flex items-center gap-1.5">
        <div
          className="flex h-6 w-6 items-center justify-center rounded-md"
          style={{ backgroundColor: collection.color }}
        >
          <p>{collection.icon}</p>
        </div>
        <p className="text-gray-200">
          {formatTextLength(collection.title, 40)}
        </p>
      </div>
    </div>
  );

  return (
    <div className="gradientBgColor absolute top-12 z-[99999] w-full rounded-sm shadow-lg">
      {(results.foundCollections.length > 0 ||
        results.foundTasks.length > 0) && (
        <div className="max-h-[70vh] text-secondaryColorL">
          {results.foundCollections.map((item) => __renderCollection(item))}
          {results.foundTasks.map((item) => __renderTask(item))}
        </div>
      )}
    </div>
  );
};

export default memo(SearchResults);
