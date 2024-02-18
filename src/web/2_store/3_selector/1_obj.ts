import { selector } from "recoil";
import { Obj } from "~/files";
import { posAdd, posRound, posSub } from "~/utils";
import { Pack, getObjKey, packToString } from "~/web/1_type";
import {
  boardState,
  hwEditorFSM,
  instanceIsSelected,
  localPacksState,
  mousePositionState,
  projectState,
  selectedObjectsState,
} from "~/web/2_store";

type ObjError = string;

export type ObjResolveExt = {
  Inst: { pack: Pack; addr?: number };
  Mem: object;
  Irq: object;
  Io: object;
  Reg: object;
};

const objResolveState = selector<({ type: "obj"; value: Obj<ObjResolveExt> } | { type: "error"; value: ObjError })[]>({
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
      switch (obj.node) {
        case "Inst": {
          // Resolve Package
          const pack = packs.find((pack) => packToString(pack) === obj.mod_path.join("/"));
          if (pack === undefined) {
            return { type: "error", value: `Cannot find package: ${obj.mod_path.join("/")} @ instances.${obj.name}` };
          }
          // Resolve Address
          let addr: number | undefined = undefined;
          if (pack.software) {
            addr = addrAcc;
            addrAcc += Math.ceil(pack.software.memSize / board.addr.pageSize);
          }
          // Resolve Position if moving
          let pos = obj.pos;
          if (state === "Moving" && instanceIsSelected(selectedObjects.objs, getObjKey(obj))) {
            pos = posAdd(pos, posRound(posSub(mousePosition, value.start)));
          }
          const ret: Obj<ObjResolveExt> = { ...obj, pack, addr, pos };
          return { type: "obj", value: ret };
        }
        case "Mem": {
          return { type: "obj", value: obj };
        }
        case "Irq": {
          return { type: "obj", value: obj };
        }
        case "Io": {
          return { type: "obj", value: obj };
        }
        case "Reg": {
          return { type: "obj", value: obj };
        }
      }
    });
  },
});

export const objResolvedState = selector<Obj<ObjResolveExt>[]>({
  key: "objResolved",
  get: ({ get }) => {
    const instances = get(objResolveState);
    return instances.flatMap((inst) => (inst.type === "obj" ? [inst.value] : []));
  },
});

export const objResolveErrorState = selector<ObjError[]>({
  key: "objResolvedError",
  get: ({ get }) => {
    const instances = get(objResolveState);
    return instances.flatMap((inst) => (inst.type === "error" ? [inst.value] : []));
  },
});
