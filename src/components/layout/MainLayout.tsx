import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { FC, PropsWithChildren } from "react";
import { openCollectionModal, openTaskModal } from "../../store";
import CollectionModal from "../collections/CollectionModal";
import TaskModal from "../task/TaskModal";
import Header from "./header/Header";

const MainLayout: FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  const hasSidebar = router.pathname !== "/collections";
  const [openModalTask] = useAtom(openTaskModal);
  const [openModalCollection] = useAtom(openCollectionModal);

  return (
    <div className="max-h[100vh] max-w-[100vw] overflow-hidden">
      <Header hasSidebar={hasSidebar} />
      <div className="bg-primaryColor">{children}</div>
      {openModalTask && <TaskModal open={openModalTask} />}
      {openModalCollection && (
        <CollectionModal open={openModalCollection.type} />
      )}
    </div>
  );
};

export default MainLayout;
