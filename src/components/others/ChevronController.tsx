import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import React from "react";

interface IProps {
  clickHandler: () => void;
  show: boolean;
}

const ChevronController = ({ clickHandler, show }: IProps) => {
  return (
    <div className={`withHover  text-textColor`} onClick={clickHandler}>
      {show ? (
        <ChevronUpIcon className=" h-5 w-5" />
      ) : (
        <ChevronDownIcon className="h-5 w-5" />
      )}
    </div>
  );
};

export default ChevronController;
