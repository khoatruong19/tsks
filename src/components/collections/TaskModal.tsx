import { DocumentIcon, FlagIcon } from "@heroicons/react/24/solid";
import { useAtom } from "jotai";
import React from "react";
import { openTaskModal } from "../../store";

const TaskModal = ({ open }: { open: string | null }) => {
  const [_, setOpenModal] = useAtom(openTaskModal);

  return (
    <div className="absolute top-0 left-0 z-[99] h-[100vh] w-[100vw] bg-black/60">
      <div className="mx-auto mt-52 w-full max-w-[500px] rounded-3xl bg-primaryColor shadow-2xl">
        <div className="px-5 py-7">
          <div className="h-12 rounded-lg border border-white/60">
            <input
              className="h-full w-full bg-transparent px-4 text-textColor/90 outline-none placeholder:text-textColor/90"
              type="text"
              placeholder={open === "Add" ? "New Task..." : "Do homework"}
            />
          </div>

          <div className="mt-4 flex items-center gap-2 ">
            <div className="withHover flex items-center gap-2  rounded-md border border-white/60 py-2 px-3">
              <DocumentIcon className="h-5 w-5 text-pink-400" />
              <span className="text-sm text-textColor/90">School</span>
            </div>
            <div className="withHover flex items-center gap-2  rounded-md border border-white/60 py-2 px-3">
              <DocumentIcon className="h-5 w-5 text-green-400" />
              <span className="text-sm text-textColor/90">Today</span>
            </div>
            <div className="withHover flex items-center gap-2  rounded-md border border-white/60 py-2 px-3">
              <FlagIcon className="h-5 w-5 text-red-400" />
            </div>
          </div>

          <div className="mt-10 flex items-center gap-4 ">
            <div className="withHover gradientBgColor flex items-center  gap-2 rounded-md py-2 px-8 shadow-xl">
              <span className="text-lg font-semibold text-textColor/90">
                Add Task
              </span>
            </div>
            <div
              className="withHover flex items-center gap-2  rounded-md bg-secondaryColor py-2 px-8 shadow-xl"
              onClick={() => setOpenModal(null)}
            >
              <span className="text-lg font-semibold text-textColor/90">
                Cancel
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
