import { MouseEvent } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { posRound, posSub } from "~/utils";
import { hwEditorFSM, mousePositionState, useCreateObj, useCreateWaypoint, useMove, useRangeSelect } from "~/web/2_store";

export const useCanvasForeground = () => {
  const mousePosition = useRecoilValue(mousePositionState);
  const [fsm, setState] = useRecoilState(hwEditorFSM);
  const createObj = useCreateObj();
  const createWaypoint = useCreateWaypoint();
  const rangeSlect = useRangeSelect();
  const move = useMove();
  return {
    onMouseUp: (e: MouseEvent) => {
      if (fsm.state === "Selecting") {
        rangeSlect(fsm.value.start, mousePosition);
        setState({ state: "Default", value: {} });
      }
      if (fsm.state === "Moving") {
        e.stopPropagation();
        const delta = posRound(posSub(mousePosition, fsm.value.start));
        move(delta);
        setState({ state: "Default", value: {} });
      }
      if (fsm.state === "AddWaypoint") {
        createWaypoint(fsm.value.wire, fsm.value.idx, posRound(mousePosition));
        setState({ state: "Default", value: {} });
      }
    },
    onClick: (e: MouseEvent) => {
      if (fsm.state === "AddNode") {
        createObj({
          ...fsm.value,
          pos: posRound(mousePosition),
          flip: false,
          width: 100, // TODO
        });
        setState({ state: "Default", value: {} });
      }
      if (fsm.state === "AddWire") {
        const path = [...fsm.value.path, posRound(mousePosition)];
        setState({ state: "AddWire", value: { ...fsm.value, path } });
      }
    },
  };
};

export const useCanvasBackground = () => {
  const mousePosition = useRecoilValue(mousePositionState);
  const [fsm, setState] = useRecoilState(hwEditorFSM);
  const rangeSlect = useRangeSelect();
  return {
    onMouseDown: () => {
      if (fsm.state === "Default") {
        setState({ state: "Selecting", value: { start: mousePosition } });
      }
    },
    onClick: () => {
      if (fsm.state === "Selecting") {
        rangeSlect(fsm.value.start, mousePosition);
        setState({ state: "Default", value: {} });
      }
    },
  };
};
