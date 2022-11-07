import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { FC, PropsWithChildren } from "react";
import { openTaskModal } from "../../store";
import TaskModal from "../collections/TaskModal";
import Header from "./header/Header";

const MainLayout: FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  const hasSidebar = router.pathname !== "/collections";
  const [openModal] = useAtom(openTaskModal);

  return (
    <div>
      <Header hasSidebar={hasSidebar} />
      <div className="bg-primaryColor">{children}</div>
      {openModal && <TaskModal open={openModal} />}
    </div>
  );
};

export default MainLayout;
