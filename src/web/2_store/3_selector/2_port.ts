import { selector } from "recoil";
import { posAdd, posFlip } from "~/utils";
import { Port } from "~/web/1_type";
import { objResolvedState } from "./1_obj";

// n: num of pin
// g: grid
// n=1 [0]
// n=2 [-g/2,g/2]
// n=3 [-g,0,g]
const getPinY = (i: number, n: number, g: number) => (-(n - 1) * g) / 2 + i * g;

export const portsState = selector<Port[]>({
  key: "ports",
  get: ({ get }) => {
    const objs = get(objResolvedState);
    return objs.flatMap((obj) => {
      return [
        ...obj.left_ports.map((port, i, arr) => ({
          key: `${obj.name}/${port.name}`,
          object: obj.name,
          name: port.name,
          direct: port.direct,
          width: port.width,
          pos: posAdd(obj.pos, [((obj.flip ? 1 : -1) * obj.width) / 2, getPinY(i, arr.length, 40)]),
        })),
        ...obj.right_ports.map((port, i, arr) => ({
          key: `${obj.name}/${port.name}`,
          object: obj.name,
          name: port.name,
          direct: port.direct,
          width: port.width,
          pos: posAdd(obj.pos, [((obj.flip ? -1 : 1) * obj.width) / 2, getPinY(i, arr.length, 40)]),
        })),
      ];
    });
  },
});
