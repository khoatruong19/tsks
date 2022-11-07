import React from "react";
import ClipLoader from "react-spinners/ClipLoader";

const Loading = () => {
  return (
    <div className="flex h-[100vh] w-[100vw] items-center justify-center bg-primaryColor">
      <ClipLoader
        color={"#393E46"}
        loading={true}
        size={100}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default Loading;
