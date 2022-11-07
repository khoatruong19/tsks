import { BellIcon } from "@heroicons/react/24/outline";
import {
  Bars3Icon,
  ClipboardDocumentIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/solid";
import { useAtom } from "jotai";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { openSidebarAtom, openTaskModal } from "../../../store";
import ActiveLink from "./ActiveLink";

interface IProps {
  hasSidebar: boolean;
}

const Header = ({ hasSidebar }: IProps) => {
  const [openSidebar, setOpenSidebar] = useAtom(openSidebarAtom);
  const [_, setOpenModal] = useAtom(openTaskModal);
  const { data } = useSession();
  return (
    <div className="w-full border-b-[1px] border-black/20 bg-secondaryColor px-6 py-4">
      <div className="flex items-center justify-between ">
        <div className="flex items-center gap-6">
          {hasSidebar && (
            <div onClick={() => setOpenSidebar(!openSidebar)}>
              <Bars3Icon className="withHover h-7 w-7 text-textColor" />
            </div>
          )}
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

        <div className="hidden items-center gap-5 lg:inline-flex">
          <div
            className="withHover gradientBgColor grid h-7 w-7 place-items-center rounded-md shadow-md"
            onClick={() => setOpenModal("Add")}
          >
            <PlusIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <MagnifyingGlassIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <BellIcon className="h-6 w-6 text-white" />
          </div>
          <div className="relative h-8 w-8 overflow-hidden rounded-full">
            <Image
              alt="avatar"
              src={data?.user?.image || ""}
              fill
              className="absolute"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
