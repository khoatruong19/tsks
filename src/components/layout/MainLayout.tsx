import React, { FC, PropsWithChildren } from "react";
import Header from "../Header";

const MainLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div>
      <Header />
      <div className="bg-primaryColor">{children}</div>
    </div>
  );
};

export default MainLayout;
