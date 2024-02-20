import { Obj, ObjViewExt, Wire } from "~/types";

export interface Project {
  target: {
    path: string[];
  };
  objs: Obj<ObjViewExt>[];
  wires: Wire[];
}
