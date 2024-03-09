import { selector } from "recoil";
import { PackPort } from "~/files";
import { Concat, Const, Demux, Fsm, Inst, Irq, Lut, Mem, Mux, Obj, ObjViewExt, Port, Reg, Slice, Vmod } from "~/types";
import { posAdd, posRound, posSub } from "~/utils";
import { Pack, getObjKey, packToString } from "~/web/1_type";
import {
  targetState,
  hwEditorFSM,
  objIsSelected,
  localPacksState,
  mousePositionState,
  projectState,
  selectedObjectsState,
} from "~/web/2_store";

type ObjError = string;

export type ObjResolveExt = {
  Inst: { pack: Pack; addr?: number; left_ports: PackPort[]; right_ports: PackPort[] };
  Mem: { addr: number; left_ports: PackPort[]; right_ports: PackPort[] };
  Irq: { left_ports: PackPort[]; right_ports: PackPort[] };
  Port: { left_ports: PackPort[]; right_ports: PackPort[] };
  Reg: { left_ports: PackPort[]; right_ports: PackPort[] };
  Lut: { left_ports: PackPort[]; right_ports: PackPort[] };
  Fsm: { left_ports: PackPort[]; right_ports: PackPort[] };
  Concat: { left_ports: PackPort[]; right_ports: PackPort[] };
  Slice: { left_ports: PackPort[]; right_ports: PackPort[] };
  Const: { left_ports: PackPort[]; right_ports: PackPort[] };
  Mux: { left_ports: PackPort[]; right_ports: PackPort[] };
  Demux: { left_ports: PackPort[]; right_ports: PackPort[] };
  Opr: { left_ports: PackPort[]; right_ports: PackPort[] };
  Vmod: { left_ports: PackPort[]; right_ports: PackPort[] };
};

const objResolveState = selector<({ type: "obj"; value: Obj<ObjViewExt & ObjResolveExt> } | { type: "error"; value: ObjError })[]>({
  key: "objResolve",
  get: ({ get }) => {
    const project = get(projectState);
    const packs = get(localPacksState);
    const board = get(targetState);
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
          return {
            type: "obj",
            value: {
              ...obj,
              pack,
              addr,
              pos,
              left_ports: pack.ports.filter((port) => port.side === "left"),
              right_ports: pack.ports.filter((port) => port.side === "right"),
            } as Inst<ObjViewExt & ObjResolveExt>,
          };
        }
        case "Mem": {
          // Resolve Address
          let addr: number | undefined = undefined;
          addr = addrAcc;
          addrAcc += Math.ceil(obj.byte / board.addr.pageSize);

          switch (obj.variant) {
            case "Write":
              return {
                type: "obj",
                value: {
                  ...obj,
                  pos,
                  addr,
                  left_ports: [{ name: "out", type: "u8", bit: 1, direct: "out", icon: "#" }],
                  right_ports: [],
                } as Mem<ObjViewExt & ObjResolveExt>,
              };
            case "Read":
              return {
                type: "obj",
                value: {
                  ...obj,
                  pos,
                  addr,
                  left_ports: [{ name: "in", type: "u8", bit: 1, direct: "in", icon: "#" }],
                  right_ports: [],
                } as Mem<ObjViewExt & ObjResolveExt>,
              };
          }
        }
        case "Irq": {
          return {
            type: "obj",
            value: {
              ...obj,
              pos,
              left_ports: [{ name: "in", type: "wire", bit: 1, direct: "in", icon: "!" }],
              right_ports: [],
            } as Irq<ObjViewExt & ObjResolveExt>,
          };
        }
        case "Port": {
          switch (obj.variant) {
            case "In":
              return {
                type: "obj",
                value: {
                  ...obj,
                  pos,
                  left_ports: [{ name: "out", type: "wire", bit: 1, direct: "out" }],
                  right_ports: [],
                } as Port<ObjViewExt & ObjResolveExt>,
              };
            case "Out":
              return {
                type: "obj",
                value: {
                  ...obj,
                  pos,
                  left_ports: [{ name: "in", type: "wire", bit: 1, direct: "in" }],
                  right_ports: [],
                } as Port<ObjViewExt & ObjResolveExt>,
              };
            case "InOut":
              return {
                type: "obj",
                value: {
                  ...obj,
                  pos,
                  left_ports: [
                    { name: "iosel", type: "wire", bit: 1, direct: "in", icon: "?" },
                    { name: "out", type: "wire", bit: 1, direct: "in" },
                    { name: "in", type: "wire", bit: 1, direct: "out" },
                  ],
                  right_ports: [],
                } as Port<ObjViewExt & ObjResolveExt>,
              };
          }
        }
        case "Reg": {
          return {
            type: "obj",
            value: {
              ...obj,
              pos,
              left_ports: [{ name: "in", type: "wire", bit: 1, direct: "in" }],
              right_ports: [{ name: "out", type: "wire", bit: 1, direct: "out" }],
            } as Reg<ObjViewExt & ObjResolveExt>,
          };
        }
        case "Lut": {
          return {
            type: "obj",
            value: {
              ...obj,
              pos,
              left_ports: [],
              right_ports: [],
            } as Lut<ObjViewExt & ObjResolveExt>,
          };
        }
        case "Fsm": {
          return {
            type: "obj",
            value: {
              ...obj,
              pos,
              left_ports: [],
              right_ports: [],
            } as Fsm<ObjViewExt & ObjResolveExt>,
          };
        }
        case "Concat": {
          return {
            type: "obj",
            value: {
              ...obj,
              pos,
              left_ports: obj.in_bits.map((w, i) => ({ name: `in${i}`, direct: "in", type: "wire", bit: w })),
              right_ports: [{ name: "out", direct: "out", type: "wire", bit: obj.in_bits.reduce((acc, cur) => acc + cur, 0) }],
            } as Concat<ObjViewExt & ObjResolveExt>,
          };
        }
        case "Slice": {
          return {
            type: "obj",
            value: {
              ...obj,
              pos,
              left_ports: [{ name: "in", direct: "in", type: "wire", bit: 1 }],
              right_ports: [{ name: "out", direct: "out", type: "wire", bit: obj.range[1] - obj.range[0] + 1 }],
            } as Slice<ObjViewExt & ObjResolveExt>,
          };
        }
        case "Const": {
          return {
            type: "obj",
            value: {
              ...obj,
              pos,
              left_ports: [],
              right_ports: [{ name: "out", type: "wire", bit: 1, direct: "out" }],
            } as Const<ObjViewExt & ObjResolveExt>,
          };
        }
        case "Mux": {
          return {
            type: "obj",
            value: {
              ...obj,
              pos,
              left_ports: Array(obj.sel).map((_, i) => ({ name: `in${i}`, direct: "in", type: `w${obj.width}`, bit: obj.bit })),
              right_ports: [],
            } as Mux<ObjViewExt & ObjResolveExt>,
          };
        }
        case "Demux": {
          return {
            type: "obj",
            value: {
              ...obj,
              pos,
              left_ports: [{ name: "in", direct: "in", type: "w1", bit: obj.bit }],
              right_ports: Array(obj.sel).map((_, i) => ({ name: `o${i}`, direct: "out", type: "w1", bit: obj.bit })),
            } as Demux<ObjViewExt & ObjResolveExt>,
          };
        }
        case "Vmod": {
          return {
            type: "obj",
            value: {
              ...obj,
              pos,
              left_ports: obj.port.filter((port) => port.side === "left"),
              right_ports: obj.port.filter((port) => port.side === "right"),
            } as Vmod<ObjViewExt & ObjResolveExt>,
          };
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
