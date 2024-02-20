import { MouseEventHandler } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { Obj } from "~/types";
import { getObjKey } from "~/web/1_type";
import {
  hwEditorFSM,
  mousePositionState,
  useAppendInstance,
  useInstanceIsSelected,
  useRenameInstance,
  useSelectObject,
} from "~/web/2_store";

export const useInst = (inst: Obj) => {
  // Global State
  const [fsm, setState] = useRecoilState(hwEditorFSM);
  const mousePosition = useRecoilValue(mousePositionState);
  const selectInstance = useSelectObject();
  const appendInstance = useAppendInstance();
  const renameInstance = useRenameInstance();

  // Calculate
  const key = getObjKey(inst);
  const selected = useInstanceIsSelected(key);
  const select = () => selectInstance(key);
  const append = () => appendInstance(key);
  const rename = (newName: string) => renameInstance(inst.name, newName);
  const onMouseDown: MouseEventHandler = (e) => {
    if (fsm.state === "Default") {
      if (!selected) select();
      setState({ state: "Moving", value: { start: mousePosition } });
    }
  };
  const onClick: MouseEventHandler = (e) => {
    if (fsm.state === "Default") {
      if (e.ctrlKey) append();
      else select();
    }
  };

  // Export
  return { key, selected, select, append, rename, onMouseDown, onClick };
};
