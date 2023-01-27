import { Collection } from "@prisma/client";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Color, ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/lib/css/styles.css";
import { collectionsList, openCollectionModal } from "../../store";
import { trpc } from "../../utils/trpc";
import {toast} from 'react-toastify'
import { messages, toastifyErrorStyles, toastifySuccessStyles } from "../../utils/constants";

const CollectionModal = ({ open }: { open: string | null }) => {
  const createCollection = trpc.collection.create.useMutation();
  const updateCollection = trpc.collection.update.useMutation();
  const [modalMode, setOpenModal] = useAtom(openCollectionModal);
  const [collections, setCollections] = useAtom(collectionsList);
  const [title, setTitle] = useState("");
  const [colorHex, setColorHex] = useColor(
    "hex",
    modalMode?.collection?.color || "#EEEEEE"
  );
  const [icon, setIcon] = useState("📃");
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [openColorPicker, setOpenColorPicker] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
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
        title: title.length  >0 ? title.trim() : "Untitled",
        color: colorHex.hex,
        icon,
      },
      {
        onSuccess: ({ collection }) => {
          toast.success(messages.createCollection, {
            style: toastifySuccessStyles
          });
          setOpenModal(null);
          setTitle("");
          setCollections([collection, ...collections])
          router.push(`/collections/${collection.slug}`);
        },
        onError: () => {
          toast.error(messages.errorMessage, {
            style: toastifyErrorStyles
          });
        }
      }
    );
  }; 

  const handleUpdateCollection = () => {
    updateCollection.mutate(
      {
        id: modalMode?.collection?.id!,
        title: title.trim(),
        color: colorHex.hex,
        icon,
      },
      {
        onSuccess: ({ updatedCollection }) => {
          toast.success(messages.updateCollection, {
            style: toastifySuccessStyles
          });
          setOpenModal(null);
          setTitle("");
          const newCollections = collections.map((item) => {
            if(item.id === updatedCollection.id) return updatedCollection
            return item
          })
          setCollections(newCollections as Partial<Collection>[])
          
          if(router.query.slug !== updatedCollection.slug) router.push(`/collections/${updatedCollection.slug}`);
        },
        onError: () => {
          toast.error(messages.errorMessage, {
            style: toastifyErrorStyles
          });
        }
      }
    );
  };

  const handleSubmitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
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
        <form onSubmit={handleSubmitForm} className="px-5 py-7">
          <div className="h-12 rounded-lg border border-white/50">
            <input
              className="h-full w-full bg-transparent px-4 text-textColor/90 outline-none placeholder:text-textColor/90"
              type="text"
              placeholder={open === "ADD" ? "New Collection..." : "Do homework"}
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
            <button
              className="withHover gradientBgColor flex items-center  gap-2 rounded-md py-2 px-8 shadow-xl"
              type="submit"
            >
              <span className="text-lg font-semibold text-textColor/90">
                {modalMode?.collection ? "Update" : "Add Collection"}
              </span>
            </button>
            <div
              className="withHover flex items-center gap-2  rounded-md bg-secondaryColor py-2 px-8 shadow-xl"
              onClick={() => setOpenModal(null)}
            >
              <span className="text-lg font-semibold text-textColor/90">
                Cancel
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CollectionModal;
