import { atom, selector, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { Position } from "~/utils";
import { Rect, corrision, corrisionRectPoint, diagonalRect } from "~/web/0_common";
import { ObjKey, WaypointKey, Wire, WireKey, getWaypointKey, objKeyEq, waypointKeyEq, wireKeyEq } from "~/web/1_type";
import { ObjResolveExt, objResolvedState } from "../3_selector/1_obj";
import { wiresResolvedState } from "../3_selector/3_wire";
import { hwEditorFSM, mousePositionState } from "../4_editor/0_fsm";
import { Obj, ObjViewExt } from "~/types";

export interface SelectedObjects {
  objs: ObjKey[];
  wires: WireKey[];
  waypoints: WaypointKey[];
}

export const selectIsEmpty = (selectedObjects: SelectedObjects): boolean =>
  selectedObjects.objs.length === 0 && selectedObjects.wires.length === 0 && selectedObjects.waypoints.length === 0;

export const selectedObjectsState = atom<SelectedObjects>({
  key: "selectedObjects",
  default: { objs: [], wires: [], waypoints: [] },
});

// --------------------------------------------------------------------------------
// Select
// オブジェクトを選択する

const selectInstance = (key: ObjKey): SelectedObjects => ({ objs: [key], wires: [], waypoints: [] });
const selectWire = (key: WireKey): SelectedObjects => ({ objs: [], wires: [key], waypoints: [] });
const selectWaypoint = (key: WaypointKey): SelectedObjects => ({ objs: [], wires: [], waypoints: [key] });

export const useSelectObject = () => {
  const setSelectedObjects = useSetRecoilState(selectedObjectsState);
  return (key: ObjKey) => setSelectedObjects(selectInstance(key));
};

export const useSelectWire = () => {
  const setSelectedObjects = useSetRecoilState(selectedObjectsState);
  return (key: WireKey) => setSelectedObjects(selectWire(key));
};

export const useSelectWaypoint = () => {
  const setSelectedObjects = useSetRecoilState(selectedObjectsState);
  return (key: WaypointKey) => setSelectedObjects(selectWaypoint(key));
};

// --------------------------------------------------------------------------------
// RangeSelect
// 範囲選択で選択されたオブジェクトを列挙する

const objRangeSelect = (objs: Obj<ObjViewExt & ObjResolveExt>[], rect: Rect): ObjKey[] => {
  return objs
    .filter((obj) => {
      if (obj.obj === "Inst") {
        return corrision({ x: obj.pos[0], y: obj.pos[1], width: obj.pack.size[0], height: obj.pack.size[1] }, rect);
      }
    })
    .map(({ name }) => name);
};

const waypointRangeSelect = (wires: Wire[], rect: Rect): WaypointKey[] => {
  return wires.flatMap((wire) => {
    return wire.waypoints.flatMap((pos, i) => (corrisionRectPoint(pos, rect) ? [getWaypointKey(wire, i)] : []));
  });
};

export const useRangeSelect = () => {
  const objs = useRecoilValue(objResolvedState);
  const wires = useRecoilValue(wiresResolvedState);
  const setSelectedObjects = useSetRecoilState(selectedObjectsState);
  // TODO: Select Wires
  return (start: Position, end: Position) => {
    const rect = diagonalRect(start[0], start[1], end[0], end[1]);
    setSelectedObjects({
      objs: objRangeSelect(objs, rect),
      wires: [],
      waypoints: waypointRangeSelect(wires, rect),
    });
  };
};

// --------------------------------------------------------------------------------
// SelecctedObjectsResolved
// 範囲選択中の場合、現在選択されているオブジェクトを返すスイッチ
// これはfacadeの範疇かもしれない

export const selectedObjectsResolvedState = selector<SelectedObjects>({
  key: "selectedOblectsResolved",
  get: ({ get }) => {
    const fsm = get(hwEditorFSM);
    const objs = get(objResolvedState);
    const wires = get(wiresResolvedState);
    const mouse = get(mousePositionState);
    const selectedObjects = get(selectedObjectsState);
    if (fsm.state === "Selecting") {
      const rect = diagonalRect(fsm.value.start[0], fsm.value.start[1], mouse[0], mouse[1]);
      return {
        objs: objRangeSelect(objs, rect),
        wires: [],
        waypoints: waypointRangeSelect(wires, rect),
      };
    } else return selectedObjects;
  },
});

// --------------------------------------------------------------------------------
// AppendSelect
// 現在の選択に追加する

const appendObj = (selected: SelectedObjects, add: ObjKey): SelectedObjects => ({
  ...selected,
  objs: [...selected.objs, add],
});

const appendWire = (selected: SelectedObjects, add: WireKey): SelectedObjects => ({
  ...selected,
  wires: [...selected.wires, add],
});

const appendWaypoint = (selected: SelectedObjects, add: WaypointKey): SelectedObjects => ({
  ...selected,
  waypoints: [...selected.waypoints, add],
});

export const useAppendInstance = () => {
  const [selectedObjects, setSelectedObjects] = useRecoilState(selectedObjectsState);
  return (add: ObjKey) => setSelectedObjects(appendObj(selectedObjects, add));
};

export const useAppendWire = () => {
  const [selectedObjects, setSelectedObjects] = useRecoilState(selectedObjectsState);
  return (add: WireKey) => setSelectedObjects(appendWire(selectedObjects, add));
};

export const useAppendWaypoint = () => {
  const [selectedObjects, setSelectedObjects] = useRecoilState(selectedObjectsState);
  return (add: WaypointKey) => setSelectedObjects(appendWaypoint(selectedObjects, add));
};

// --------------------------------------------------------------------------------
// IsSelected
// オブジェクトが選択されているか判定する

export const objIsSelected = (selectedObjs: ObjKey[], find: ObjKey) => selectedObjs.find((obj) => objKeyEq(obj, find)) !== undefined;

export const wireIsSelected = (selectedWires: WireKey[], find: WireKey) =>
  selectedWires.find((wire) => wireKeyEq(wire, find)) !== undefined;

export const waypointIsSelected = (selectedWaypoints: WaypointKey[], find: WaypointKey) =>
  selectedWaypoints.find((waypoint) => waypointKeyEq(waypoint, find)) !== undefined;

export const useInstanceIsSelected = (find: ObjKey) => {
  const selectedObjects = useRecoilValue(selectedObjectsResolvedState);
  return objIsSelected(selectedObjects.objs, find);
};

export const useWireIsSelected = (find: WireKey) => {
  const selectedObjects = useRecoilValue(selectedObjectsResolvedState);
  return wireIsSelected(selectedObjects.wires, find);
};

export const useWaypointIsSelected = (find: WaypointKey) => {
  const selectedObjects = useRecoilValue(selectedObjectsResolvedState);
  return waypointIsSelected(selectedObjects.waypoints, find);
};
