import { BookOpenIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import React from "react";
import { getCircumfence } from "../../utils/constants";

const circumference = getCircumfence(15);

const CollectionCard = () => {
  const router = useRouter();
  return (
    <div
      className="withHover rounded-3xl bg-secondaryColor"
      onClick={() => router.push("/collections/asd")}
    >
      <div className="p-4 md:p-5">
        <div className="mb-10 grid max-w-fit place-items-center rounded-md bg-slate-300 p-2">
          <BookOpenIcon className="h-5 w-5" />
        </div>
        <h1 className="mb-1.5 text-2xl font-bold text-textColor">School</h1>
        <div className="flex items-center  justify-between">
          <span className="text-sm text-white/60">4/8 done</span>
          <div className="flex items-center justify-center">
            <svg className=" h-10 w-10">
              <circle
                className="text-primaryColor "
                stroke-width="5"
                stroke="currentColor"
                fill="transparent"
                r="15"
                cx="20"
                cy="20"
              />
              <circle
                className=" text-tertiaryColor"
                stroke-width="5"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - (10 / 20) * circumference}
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
