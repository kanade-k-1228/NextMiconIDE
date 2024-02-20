import { selector } from "recoil";
import { posAdd, posFlip } from "~/utils";
import { Port } from "~/web/1_type";
import { objResolvedState } from "./1_obj";

export const portsState = selector<Port[]>({
  key: "ports",
  get: ({ get }) => {
    const objs = get(objResolvedState);
    const objsPorts = objs.flatMap((obj) => {
      switch (obj.obj) {
        case "Inst":
          return obj.pack.ports.map((port) => ({
            key: `${obj.name}/${port.name}`,
            object: obj.name,
            name: port.name,
            direct: port.direct,
            width: port.width,
            pos: posAdd(obj.pos, obj.flip ? posFlip(port.pos) : port.pos),
          }));
        case "Mem":
          return [];
        case "Irq":
          return [];
        case "Port":
          return [];
        case "Reg":
          return [];
      }
    });
    return objsPorts;
  },
});
