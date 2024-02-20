import { atom } from "recoil";
import { Position } from "~/utils";
import { PortKey, WireKey } from "~/web/1_type";
import { Obj } from "~/types";

export const mousePositionState = atom<Position>({ key: "mousePosition", default: [0, 0] });

export type States =
  | { state: "Default"; value: {} }
  | { state: "Selecting"; value: { start: Position } }
  | { state: "Moving"; value: { start: Position } }
  | { state: "AddNode"; value: Obj }
  | { state: "AddWaypoint"; value: { wire: WireKey; idx: number } }
  | { state: "AddWire"; value: { start: PortKey; startPos: Position; path: Position[] } };

export const hwEditorFSM = atom<States>({ key: "hwEditorState", default: { state: "Default", value: {} } });
