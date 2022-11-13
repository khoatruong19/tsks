import { BookOpenIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
import { Collection } from "@prisma/client";
import { useRouter } from "next/router";
import React from "react";
import { CollectionWithTasksQuantity } from "../../types/collection.type";
import { getCircumfence } from "../../utils/constants";

const circumference = getCircumfence(15);

interface IProps {
  collection: CollectionWithTasksQuantity;
}

const CollectionCard = ({ collection }: IProps) => {
  const router = useRouter();
  const doneTasks = collection.tasks.filter(
    (task) => task.done === true
  )?.length;
  return (
    <div
      className="withHover rounded-3xl bg-secondaryColor"
      onClick={() => router.push(`/collections/${collection.slug}`)}
    >
      <div className=" p-4 md:p-6">
        <div className="mb-8  flex items-center justify-between">
          <div
            className="grid max-w-fit place-items-center rounded-md p-1.5"
            style={{ backgroundColor: collection.color }}
          >
            <p className="text-lg">{collection.icon}</p>
          </div>
          {collection.isFavourite && (
            <div className="ml-[-10px]">
              <StarIcon className="h-6 w-6 text-yellow-400" />
            </div>
          )}
        </div>

        <h1 className="mb-3  text-2xl font-bold text-textColor">
          {collection.title}
        </h1>
        <div className="flex items-center  justify-between">
          <span className="text-sm text-white/60">
            {doneTasks}/{collection.tasks.length} done
          </span>
          <div className="flex items-center justify-center">
            <svg className=" h-10 w-10">
              <circle
                className="text-primaryColor "
                strokeWidth="5"
                stroke="currentColor"
                fill="transparent"
                r="15"
                cx="20"
                cy="20"
              />
              <circle
                className=" text-tertiaryColor"
                strokeWidth="5"
                strokeDasharray={circumference}
                strokeDashoffset={
                  collection.tasks.length > 0
                    ? circumference -
                      (doneTasks / collection.tasks.length) * circumference
                    : circumference
                }
                stroke-linecap="round"
                stroke="currentColor"
                fill="transparent"
                r="15"
                cx="20"
                cy="20"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionCard;
