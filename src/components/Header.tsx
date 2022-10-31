import React from "react";
import {
  ClipboardDocumentIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import ActiveLink from "./ActiveLink";

const Header = () => {
  return (
    <div className="w-full bg-secondaryColor px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-10">
          <ActiveLink activeClassName="text-textColor" href="/">
            <div className="flex cursor-pointer items-center gap-2 ">
              <Squares2X2Icon className="h-7 w-7" />
              <span className="font-medium">Dashboard</span>
            </div>
          </ActiveLink>
          <ActiveLink href="/collections" activeClassName="text-textColor">
            <div className="flex cursor-pointer items-center gap-2">
              <ClipboardDocumentIcon className="h-7 w-7" />
              <span className="font-medium ">Collections</span>
            </div>
          </ActiveLink>
        </div>

        <div className="hidden items-center gap-3 lg:inline-flex">
          <Squares2X2Icon className="h-7 w-7" />
          <Squares2X2Icon className="h-7 w-7" />
          <Squares2X2Icon className="h-7 w-7" />
        </div>
      </div>
    </div>
  );
};

export default Header;
