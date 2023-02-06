import React from "react";
import Loader from "../others/Loader";

const Loading = () => {
  return (
    <div className="flex h-[100vh] w-[100vw] items-center justify-center bg-primaryColorL dark:bg-primaryColor">
      <Loader/>
    </div>
  );
};

export default Loading;
