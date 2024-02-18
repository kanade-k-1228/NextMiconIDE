export interface ExtObj {
  Inst: object;
  Mem: object;
  Irq: object;
  Io: object;
  Reg: object;
}

export type Obj<Ext extends ExtObj = ExtObj> = Inst<Ext> | Mem<Ext> | Irq<Ext> | Io<Ext> | Reg<Ext>;

export type Inst<Ext extends ExtObj = ExtObj> = {
  node: "Inst";
  name: string;
  mod_path: string[];
  params: { name: string; value: string }[];
} & ObjView &
  Ext["Inst"];

type Mem<Ext extends ExtObj = ExtObj> = {
  node: "Mem";
  name: string;
  direct: "Read" | "Write";
  byte: number;
} & ObjView &
  Ext["Mem"];

type Irq<Ext extends ExtObj = ExtObj> = {
  node: "Irq";
  name: string;
  sw_stmts: string[];
} & ObjView &
  Ext["Irq"];

type Io<Ext extends ExtObj = ExtObj> = {
  node: "Io";
  name: string;
  direct: "In" | "Out" | "InOut";
} & ObjView &
  Ext["Io"];

type Reg<Ext extends ExtObj = ExtObj> = {
  node: "Reg";
  name: string;
  type: string;
  init?: number;
} & ObjView &
  Ext["Reg"];

type ObjView = { pos: [number, number]; flip: boolean; width: number };

export type Wire = {
  first: [string, string];
  last: [string, string];
  width: number;
  waypoints: [number, number][];
};

export interface Project {
  target: string[];
  objs: Obj[];
  wires: Wire[];
}
