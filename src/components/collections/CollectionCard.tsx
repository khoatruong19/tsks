import { CheckIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";
import { CollectionWithTasksQuantity } from "../../types/collection.type";
import { getCircumfence } from "../../utils/constants";

const circumference = getCircumfence(15);

interface IProps {
  collection: CollectionWithTasksQuantity;
}

const CollectionCard = ({ collection }: IProps) => {
  const router = useRouter();
  const doneTasksCount = collection.tasks.filter(
    (task) => task.done === true
  )?.length;
  return (
    <div
      className="withHover rounded-3xl bg-secondaryColorL dark:bg-secondaryColor shadow-md"
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

        <h1 className="mb-3  break-words text-2xl font-bold text-textColorL dark:text-textColor">
          {collection.title && collection.title.length > 13
            ? collection.title.slice(0, 13) + "..."
            : collection.title}
        </h1>
        <div className="flex items-center  justify-between">
          <span className="text-sm text-tertiaryColorL dark:text-white/60">
            {doneTasksCount}/{collection.tasks.length} done
          </span>
          <div className="flex items-center justify-center">
            {doneTasksCount !== 0 &&
            doneTasksCount === collection.tasks.length ? (
              <span
                className="flex h-[36px] w-[36px] items-center justify-center rounded-full border-[3px] border-primaryColorL shadow-md dark:border-primaryColor/80"
                style={{ backgroundColor: collection.color }}
              >
                <CheckIcon className="h-[20px] w-[20px] text-tertiaryColorL dark:text-white" />
              </span>
            ) : (
              <svg className=" h-10 w-10 rounded-full shadow-md p-0">
                <circle
                  className="text-primaryColorL dark:text-primaryColor/50"
                  strokeWidth="5"
                  stroke="currentColor"
                  fill="transparent"
                  r="15"
                  cx="20"
                  cy="20"
                />

                <circle
                  color={collection.color}
                  strokeWidth="5"
                  strokeDasharray={circumference}
                  strokeDashoffset={
                    collection.tasks.length > 0
                      ? circumference -
                        (doneTasksCount / collection.tasks.length) *
                          circumference
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionCard;
