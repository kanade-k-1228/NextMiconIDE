import { selector } from "recoil";
import { wiresResolvedState } from "./3_wire";

export const waypointsState = selector<{}[]>({
  key: "paths",
  get: ({ get }) => {
    const wires = get(wiresResolvedState);
    wires.flatMap((wire) => {});
    return [];
  },
});
