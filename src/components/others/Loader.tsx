import React from "react";
import { ClipLoader } from "react-spinners";

const Loader = () => {
  return (
    <div className="grid h-[100%] place-items-center">
      <ClipLoader
        color={"#393E46"}
        loading={true}
        size={80}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default Loader;
