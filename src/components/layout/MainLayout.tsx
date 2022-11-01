import { useRouter } from "next/router";
import React, { FC, PropsWithChildren } from "react";
import Header from "./header/Header";

const MainLayout: FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  const hasSidebar = router.pathname !== "/collections";
  return (
    <div>
      <Header hasSidebar={hasSidebar} />
      <div className="bg-primaryColor">{children}</div>
    </div>
  );
};

export default MainLayout;
