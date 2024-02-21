import { selector } from "recoil";
import { Obj, ObjViewExt } from "~/types";
import { posAdd, posRound, posSub } from "~/utils";
import { Pack, getObjKey, packToString } from "~/web/1_type";
import {
  boardState,
  hwEditorFSM,
  objIsSelected,
  localPacksState,
  mousePositionState,
  projectState,
  selectedObjectsState,
} from "~/web/2_store";

type ObjError = string;

export type ObjResolveExt = {
  Inst: { pack: Pack; addr?: number };
  Mem: { ports: {} };
  Irq: object;
  Port: object;
  Reg: object;
  Lut: object;
  Fsm: object;
  Concat: object;
  Slice: object;
  Const: object;
  VMod: object;
};

const objResolveState = selector<({ type: "obj"; value: Obj<ObjViewExt & ObjResolveExt> } | { type: "error"; value: ObjError })[]>({
  key: "objResolve",
  get: ({ get }) => {
    const project = get(projectState);
    const packs = get(localPacksState);
    const board = get(boardState);
    const { state, value } = get(hwEditorFSM);
    const mousePosition = get(mousePositionState);
    const selectedObjects = get(selectedObjectsState);

    let addrAcc = Math.ceil(board.addr.reserved / board.addr.pageSize);
    return project.objs.map((obj) => {
      // Resolve Position if moving
      let pos = obj.pos;
      if (state === "Moving" && objIsSelected(selectedObjects.objs, getObjKey(obj))) {
        pos = posAdd(pos, posRound(posSub(mousePosition, value.start)));
      }

      switch (obj.obj) {
        case "Inst": {
          // Resolve Package
          const pack = packs.find((pack) => packToString(pack) === obj.mod.join("/"));
          if (pack === undefined) {
            return { type: "error", value: `Cannot find package: ${obj.mod.join("/")} @ instances.${obj.name}` };
          }
          // Resolve Address
          let addr: number | undefined = undefined;
          if (pack.software) {
            addr = addrAcc;
            addrAcc += Math.ceil(pack.software.memSize / board.addr.pageSize);
          }
          return { type: "obj", value: { ...obj, pack, addr, pos } };
        }
        case "Mem": {
          return { type: "obj", value: { ...obj, pos, ports: {} } };
        }
        case "Irq": {
          return { type: "obj", value: { ...obj, pos } };
        }
        case "Port": {
          return { type: "obj", value: { ...obj, pos } };
        }
        case "Reg": {
          return { type: "obj", value: { ...obj, pos } };
        }
        case "Lut": {
          return { type: "obj", value: { ...obj, pos } };
        }
        case "Fsm": {
          return { type: "obj", value: { ...obj, pos } };
        }
        case "Concat": {
          return { type: "obj", value: { ...obj, pos } };
        }
        case "Slice": {
          return { type: "obj", value: { ...obj, pos } };
        }
        case "Const": {
          return { type: "obj", value: { ...obj, pos } };
        }
        case "VMod": {
          return { type: "obj", value: { ...obj, pos, ports: [] } };
        }
      }
    });
  },
});

export const objResolvedState = selector<Obj<ObjViewExt & ObjResolveExt>[]>({
  key: "objResolved",
  get: ({ get }) => {
    const objs = get(objResolveState);
    return objs.flatMap((inst) => (inst.type === "obj" ? [inst.value] : []));
  },
});

export const objResolveErrorState = selector<ObjError[]>({
  key: "objResolvedError",
  get: ({ get }) => {
    const objs = get(objResolveState);
    return objs.flatMap((inst) => (inst.type === "error" ? [inst.value] : []));
  },
});
