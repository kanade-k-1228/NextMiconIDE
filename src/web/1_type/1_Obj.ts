import { Obj } from "~/files";
import { Position } from "~/utils";
import { Pack } from "~/web/1_type";

export type ObjKey = string;
export const getObjKey = (obj: Obj) => obj.name;
export const objKeyEq = (lhs: ObjKey, rhs: ObjKey) => lhs === rhs;
