import { DocumentIcon, FlagIcon } from "@heroicons/react/24/solid";
import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import { openCollectionModal } from "../../store";
import { trpc } from "../../utils/trpc";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { ColorPicker, useColor, Color } from "react-color-palette";
import "react-color-palette/lib/css/styles.css";

const CollectionModal = ({ open }: { open: string | null }) => {
  const createCollection = trpc.collection.create.useMutation();
  const updateCollection = trpc.collection.update.useMutation();
  const [modalMode, setOpenModal] = useAtom(openCollectionModal);
  const [title, setTitle] = useState("");
  const [colorHex, setColorHex] = useColor(
    "hex",
    modalMode?.collection?.color || "#EEEEEE"
  );
  const [icon, setIcon] = useState("📃");
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [openColorPicker, setOpenColorPicker] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const qc = useQueryClient();
  const router = useRouter();

  const handleTriggerEmojiPicker = () => {
    openColorPicker && setOpenColorPicker(false);
    setOpenEmojiPicker((prev) => !prev);
  };

  const handleTriggerColorPicker = () => {
    openEmojiPicker && setOpenEmojiPicker(false);
    setOpenColorPicker((prev) => !prev);
  };

  const handleSelectIcon = (e: EmojiClickData) => {
    setIcon(e.emoji);
    setOpenEmojiPicker(false);
  };
  const handleSelectColor = (color: Color) => {
    setColorHex(color);
  };

  const handleCreateCollection = () => {
    createCollection.mutate(
      {
        title,
        color: colorHex.hex,
        icon,
      },
      {
        onSuccess: ({ collection }) => {
          setOpenModal(null);
          setTitle("");
          qc.invalidateQueries("collection.getAllCollections");
          router.replace(`/collections/${collection.slug}`);
        },
      }
    );
  };

  const handleUpdateCollection = () => {
    updateCollection.mutate(
      {
        id: modalMode?.collection?.id!,
        title,
        color: colorHex.hex,
        icon,
      },
      {
        onSuccess: ({ slug }) => {
          setOpenModal(null);
          setTitle("");
          qc.invalidateQueries("collection.getAllCollections");
          router.replace(`/collections/${slug}`);
        },
      }
    );
  };

  const handleSubmitForm = () => {
    if (modalMode?.type === "ADD") {
      handleCreateCollection();
      return;
    } else handleUpdateCollection();
  };

  useEffect(() => {
    if (modalMode?.collection) {
      setTitle(modalMode.collection.title!);
      setIcon(modalMode.collection.icon!);
    }
  }, [modalMode]);

  useEffect(() => {
    const handleCloseAllPicker = () => {
      setOpenEmojiPicker(false);
      setOpenColorPicker(false);
    };

    if (containerRef && containerRef.current) {
      containerRef.current.addEventListener("click", handleCloseAllPicker);
    }
    return () => {
      if (containerRef && containerRef.current)
        containerRef.current.removeEventListener("click", handleCloseAllPicker);
    };
  }, [containerRef]);

  return (
    <div
      ref={containerRef}
      className="absolute top-0 left-0 z-[99] h-[100vh] w-[100vw] bg-black/60"
    >
      <div className="mx-auto mt-52 w-full max-w-[500px] rounded-3xl bg-primaryColor shadow-2xl">
        <div className="px-5 py-7">
          <div className="h-12 rounded-lg border border-white/50">
            <input
              className="h-full w-full bg-transparent px-4 text-textColor/90 outline-none placeholder:text-textColor/90"
              type="text"
              placeholder={open === "Add" ? "New Collection..." : "Do homework"}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="relative mt-4 flex items-center gap-2 ">
            <div
              className="withHover  flex items-center gap-2 rounded-md border border-white/50 py-1 px-3"
              onClick={handleTriggerEmojiPicker}
            >
              <span className="text-sm text-textColor/90">Icon:</span>
              <span className="text-2xl text-textColor/90">{icon}</span>
            </div>
            {openEmojiPicker && (
              <div className="absolute top-12 z-[9999]">
                <EmojiPicker onEmojiClick={handleSelectIcon} />
              </div>
            )}
            <div
              className="withHover flex items-center gap-2  rounded-md border border-white/50 py-2 px-3"
              onClick={handleTriggerColorPicker}
            >
              <span className="text-sm text-textColor/90">Color:</span>
              <span
                className="h-6 w-6 rounded-md"
                style={{ backgroundColor: colorHex.hex }}
              />
            </div>
            {openColorPicker && (
              <div className="absolute top-12 z-[9999]">
                <ColorPicker
                  width={456}
                  height={228}
                  color={colorHex}
                  onChange={handleSelectColor}
                  hideHSV
                  hideRGB
                  dark
                />
                ;
              </div>
            )}
            <div
              className={` ml-2 grid place-items-center rounded-md p-2`}
              style={{ backgroundColor: `${colorHex.hex}` }}
            >
              {icon}
            </div>
          </div>

          <div className=" mt-10 flex items-center gap-4">
            <div
              className="withHover gradientBgColor flex items-center  gap-2 rounded-md py-2 px-8 shadow-xl"
              onClick={handleSubmitForm}
            >
              <span className="text-lg font-semibold text-textColor/90">
                {modalMode?.collection ? "Update" : "Add Collection"}
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
