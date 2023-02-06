import { useAtom } from "jotai";
import React from "react";
import { ClipLoader } from "react-spinners";
import { themeMode } from "../../store";

const Loader = () => {
  const [theme, _] = useAtom(themeMode)
  return (
    <div className="grid h-[100%] place-items-center">
      <ClipLoader
        color={theme === "dark" ? "#393E46" : "#F2DEBA"}
        loading={true}
        size={80}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default Loader;
