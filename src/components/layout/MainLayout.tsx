import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { FC, PropsWithChildren } from "react";
import { openCollectionModal, openTaskModal, tasksList } from "../../store";
import CollectionModal from "../collections/CollectionModal";
import TaskModal from "../task/TaskModal";
import Header from "./header/Header";
import {useEffect} from "react"
import { trpc } from "../../utils/trpc";

const MainLayout: FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  const hasSidebar = router.pathname !== "/collections";
  const [openModalTask] = useAtom(openTaskModal);
  const [openModalCollection] = useAtom(openCollectionModal);
  const {data, isLoading} = trpc.task.getAllTasksByUser.useQuery()
  const [_, setAllTasksByUser] = useAtom(tasksList)
  
  useEffect(() => {
    if(data) {
      setAllTasksByUser(data)
    }
  }, [data, isLoading])

  return (
    <div className="max-h[100vh] max-w-[100vw] overflow-hidden">
      <Header hasSidebar={hasSidebar} />
      <div className="bg-primaryColorL dark:bg-primaryColor">{children}</div>
      {openModalTask && <TaskModal />}
      {openModalCollection && (
        <CollectionModal open={openModalCollection.type} />
      )}
    </div>
  );
};

export default MainLayout;
