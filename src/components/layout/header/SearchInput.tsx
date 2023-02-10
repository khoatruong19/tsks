import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useRef, useEffect, useState } from "react";
import SearchResults from "./SearchResults";

interface IProps {
  openSearch: boolean;
  setOpenSearch: (value: boolean) => void;
}

const SearchInput = ({ openSearch, setOpenSearch }: IProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLInputElement>(null);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [inputRef,openSearch]);

  useEffect(() => {
    const checkClickOutside = (event: any) => {
      if (!openSearch) return;
      if (containerRef.current && !containerRef.current.contains(event.target))
        setOpenSearch(false);
    };

    window.addEventListener("click", checkClickOutside);

    return () => {
      window.removeEventListener("click", checkClickOutside);
    };
  }, [openSearch]);

  return (
    <div ref={containerRef}>
      <div
        className={`withHover ${openSearch && "hidden"}`}
        onClick={() => setOpenSearch(true)}
      >
        <MagnifyingGlassIcon className="h-6 w-6" />
      </div>
      <div className={`relative w-[200px] transition-all duration-75 ease-in-out md:w-[350px] lg:w-[450px] ${!openSearch && "hidden"}`}>
        <div className="flex h-10 items-center gap-1.5 rounded-sm bg-primaryColorL py-1 px-2 dark:bg-primaryColor">
          <MagnifyingGlassIcon className="h-6 w-6 text-textColorL dark:text-gray-500" />
          <input
            ref={inputRef}
            className="h-full flex-1 bg-transparent outline-none"
            placeholder="Search task, collection...."
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <XMarkIcon
            onClick={() => setOpenSearch(false)}
            className="withHover h-6 w-6 text-textColorL dark:text-gray-500"
          />
        </div>
        <SearchResults
          closeSearch={() => setOpenSearch(false)}
          keyword={keyword}
        />
      </div>
    </div>
  );
};

export default SearchInput;
