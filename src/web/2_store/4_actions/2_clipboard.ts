import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { Project } from "~/files";
import { Position, posAdd, posMid, posRound, posSub } from "~/utils";
import { ObjKey, PortKey, WireKey, getObjKey, getWireKey, objKeyEq, wireKeyEq } from "~/web/1_type";
import { targetState, projectState } from "../2_project/0_project";
import { useRevert } from "../2_project/2_revert";
import { mousePositionState } from "../4_editor/0_fsm";
import { selectIsEmpty, selectedObjectsResolvedState } from "./0_select";
import { createObj, createWire, getNewObjName } from "./1_create";
import { Obj, ObjViewExt, Wire } from "~/types";

interface Clipboard {
  objs: Obj<ObjViewExt>[];
  wires: Wire[];
}

const clipboardEmpty = (clipboard: Clipboard) => clipboard.objs.length === 0 && clipboard.wires.length === 0;

const clipboardState = atom<Clipboard>({ key: "hwClipboard", default: { objs: [], wires: [] } });

const getClipboardRange = (clipboard: Clipboard) => {
  return { min: [0, 0] as Position, max: [500, 500] as Position };
};

// --------------------------------------------------------------------------------
// Copy

const copyInstance = (clipboard: Clipboard, key: ObjKey, project: Project): Clipboard => {
  const found = project.objs.find((obj) => objKeyEq(getObjKey(obj), key));
  return found ? { ...clipboard, objs: [...clipboard.objs, found] } : clipboard;
};

const copyWire = (clipboard: Clipboard, key: WireKey, project: Project): Clipboard => {
  const found = project.wires.find((wire) => wireKeyEq(getWireKey(wire), key));
  return found ? { ...clipboard, wires: [...clipboard.wires, found] } : clipboard;
};

export const useCopy = () => {
  const setHwClipboard = useSetRecoilState(clipboardState);
  const project = useRecoilValue(projectState);
  const selectedObjects = useRecoilValue(selectedObjectsResolvedState);
  return () => {
    if (!selectIsEmpty(selectedObjects)) {
      console.log("Copy", selectedObjects);
      let ret: Clipboard = { objs: [], wires: [] };
      ret = selectedObjects.objs.reduce((acc, key) => copyInstance(acc, key, project), ret);
      ret = selectedObjects.wires.reduce((acc, key) => copyWire(acc, key, project), ret);
      setHwClipboard(ret);
    }
  };
};

// --------------------------------------------------------------------------------
// Paste

const pasteObj = (project: Project, instance: Project["objs"][number], delta: Position): Project => {
  return createObj(project, {
    ...instance,
    name: getNewObjName(project, instance.name),
    pos: posAdd(instance.pos, delta),
  });
};

const pasteWire = (project: Project, wire: Project["wires"][number]): Project => {
  console.log("TODO: Paste Wire", wire);
  return project;
};

export const usePaste = () => {
  const { commit } = useRevert();
  const clipboard = useRecoilValue(clipboardState);
  const mousePosition = useRecoilValue(mousePositionState);
  const [project, setProject] = useRecoilState(projectState);
  const board = useRecoilValue(targetState);
  return () => {
    if (!clipboardEmpty(clipboard)) {
      console.log("Paste", clipboard, mousePosition);

      // Calculate Delta
      const range = getClipboardRange(clipboard);
      const mid = posMid(range.max, range.min);
      const delta = posRound(posSub(mousePosition, mid));

      // Generate new objects
      const newobjs = clipboard.objs.map((instance) => ({
        ...instance,
        name: getNewObjName(project, instance.name),
        pos: posAdd(instance.pos, delta),
        oldName: instance.name,
      }));
      const newWires = clipboard.wires.flatMap((wire) => {
        const fromObj = newobjs.find(({ oldName }) => oldName === wire.first[0]);
        const toObj = newobjs.find(({ oldName }) => oldName === wire.last[0]);
        const newFrom = fromObj?.name;
        const newTo = toObj?.name;
        if (newFrom && newTo) {
          return [
            {
              ...wire,
              from: [newFrom, wire.first[1]] as PortKey,
              to: [newTo, wire.last[1]] as PortKey,
              waypoints: wire.waypoints.map((pos) => posAdd(pos, delta)),
            },
          ];
        } else return [];
      });

      // Clone Objects
      let ret = project;
      ret = newobjs.reduce((acc, inst) => createObj(acc, inst), ret);
      // ret = newIoports.reduce((acc, key) => createIoport(acc, key), ret);
      ret = newWires.reduce((acc, key) => createWire(acc, key), ret);
      setProject(ret);

      // TODO : Select new objects

      commit();
    }
  };
};
