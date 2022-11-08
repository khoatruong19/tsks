import { DocumentIcon, FlagIcon } from "@heroicons/react/24/solid";
import { useAtom } from "jotai";
import { openCollectionModal } from "../../store";
import { trpc } from "../../utils/trpc";

const CollectionModal = ({ open }: { open: string | null }) => {
  const createCollection = trpc.collection.create.useMutation();
  const [_, setOpenModal] = useAtom(openCollectionModal);

  const handleCreateCollection = () => {
    createCollection.mutate(
      {
        title: "New collection",
      },
      {
        onSuccess: () => {
          setOpenModal(null);
        },
      }
    );
  };

  return (
    <div className="absolute top-0 left-0 z-[99] h-[100vh] w-[100vw] bg-black/60">
      <div className="mx-auto mt-52 w-full max-w-[500px] rounded-3xl bg-primaryColor shadow-2xl">
        <div className="px-5 py-7">
          <div className="h-12 rounded-lg border border-white/50">
            <input
              className="h-full w-full bg-transparent px-4 text-textColor/90 outline-none placeholder:text-textColor/90"
              type="text"
              placeholder={open === "Add" ? "New Collection..." : "Do homework"}
            />
          </div>

          <div className="mt-4 flex items-center gap-2 ">
            <div className="withHover flex items-center gap-2  rounded-md border border-white/50 py-2 px-3">
              <DocumentIcon className="h-5 w-5 text-pink-400" />
              <span className="text-sm text-textColor/90">School</span>
            </div>
            <div className="withHover flex items-center gap-2  rounded-md border border-white/50 py-2 px-3">
              <DocumentIcon className="h-5 w-5 text-green-400" />
              <span className="text-sm text-textColor/90">Today</span>
            </div>
            <div className="withHover flex items-center gap-2  rounded-md border border-white/50 py-2 px-3">
              <FlagIcon className="h-5 w-5 text-red-400" />
            </div>
          </div>

          <div className="mt-10 flex items-center gap-4 ">
            <div
              className="withHover gradientBgColor flex items-center  gap-2 rounded-md py-2 px-8 shadow-xl"
              onClick={handleCreateCollection}
            >
              <span className="text-lg font-semibold text-textColor/90">
                Add Collection
              </span>
            </div>
            <div
              className="withHover flex items-center gap-2  rounded-md bg-secondaryColor py-2 px-8 shadow-xl"
              onClick={() => setOpenModal(null)}
            >
              <span className="text-lg font-semibold text-textColor/90">
                Cancel
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionModal;
