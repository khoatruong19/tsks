import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import React from "react";

interface IProps {
  clickHandler: () => void;
  show: boolean;
  overlay?: boolean;
}

const ChevronController = ({ clickHandler, show, overlay }: IProps) => {
  return (
    <div
      className={`withHover  text-textColor ${
        overlay
          ? `absolute right-1 top-1 p-2
      `
          : ""
      }`}
      onClick={clickHandler}
    >
      {show ? (
        <ChevronDownIcon className=" h-5 w-5" />
      ) : (
        <ChevronUpIcon className="h-5 w-5" />
      )}
    </div>
  );
};

export default ChevronController;
