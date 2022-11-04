import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { FC, PropsWithChildren, useEffect } from "react";
import Header from "./header/Header";

const MainLayout: FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  const hasSidebar = router.pathname !== "/collections";
  const { status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status]);

  return (
    <div>
      <Header hasSidebar={hasSidebar} />
      <div className="bg-primaryColor">{children}</div>
    </div>
  );
};

export default MainLayout;
