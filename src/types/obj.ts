export interface ObjExt {
  Inst: object;
  Mem: object;
  Irq: object;
  Port: object;
  Reg: object;
  Lut: object;
  Fsm: object;
  Concat: object;
  Slice: object;
  Const: object;
  VMod: object;
}

export type Obj<Ext extends ObjExt = ObjExt> =
  | Inst<Ext>
  | Mem<Ext>
  | Irq<Ext>
  | Port<Ext>
  | Reg<Ext>
  | Lut<Ext>
  | Fsm<Ext>
  | Concat<Ext>
  | Slice<Ext>
  | Const<Ext>
  | VMod<Ext>;

export type Inst<Ext extends ObjExt = ObjExt> = { obj: "Inst"; name: string; mod: string[]; params: Params } & Ext["Inst"];
export type Mem<Ext extends ObjExt = ObjExt> = { obj: "Mem"; name: string; variant: "RW" | "RO"; byte: number } & Ext["Mem"];
export type Irq<Ext extends ObjExt = ObjExt> = { obj: "Irq"; name: string; sw_stmts: string[] } & Ext["Irq"];
export type Port<Ext extends ObjExt = ObjExt> = { obj: "Port"; name: string; variant: "In" | "Out" | "InOut" } & Ext["Port"];
export type Reg<Ext extends ObjExt = ObjExt> = { obj: "Reg"; name: string; type: string; init?: number } & Ext["Reg"];
export type Lut<Ext extends ObjExt = ObjExt> = { obj: "Lut"; name: string; input: number; output: number } & Ext["Lut"];
export type Fsm<Ext extends ObjExt = ObjExt> = { obj: "Fsm"; name: string; input: number; state: number } & Ext["Fsm"];
export type Concat<Ext extends ObjExt = ObjExt> = { obj: "Concat"; name: string; input: string[]; out_width: number } & Ext["Concat"];
export type Slice<Ext extends ObjExt = ObjExt> = { obj: "Slice"; name: string; input: string; range: [number, number] } & Ext["Slice"];
export type Const<Ext extends ObjExt = ObjExt> = { obj: "Const"; name: string; width: number; value: number } & Ext["Const"];
export type VMod<Ext extends ObjExt = ObjExt> = {
  obj: "VMod";
  name: string;
  port: { name: string; direct: "In" | "Out" | "InOut"; width: number }[];
} & Ext["VMod"];

type Params = { name: string; value: string }[];

// --------------------------------------------------------------------------------
// View

type ObjView = {
  pos: [number, number];
  flip: boolean;
  width: number;
};

export interface ObjViewExt {
  Inst: ObjView;
  Mem: ObjView;
  Irq: ObjView;
  Port: ObjView;
  Reg: ObjView;
  Lut: ObjView;
  Fsm: ObjView;
  Concat: ObjView;
  Slice: ObjView;
  Const: ObjView;
  VMod: ObjView;
}
