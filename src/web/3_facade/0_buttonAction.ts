import { useCopy, useDelete, useFlip, usePaste, useRevert, useSaveProject, useSort } from "../2_store";

export const useButtonAction = () => {
  const save = useSaveProject();
  const { undo, redo } = useRevert();
  const copy = useCopy();
  const paste = usePaste();
  const del = useDelete();
  const flip = useFlip();
  const sort = useSort();

  return { del, flip, copy, paste, undo, redo, save, sort };
};
