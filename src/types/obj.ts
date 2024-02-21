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
  Mux: object;
  Demux: object;
  Const: object;
  Opr: object;
  Vmod: object;
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
  | Mux<Ext>
  | Demux<Ext>
  | Const<Ext>
  | Vmod<Ext>;

export type Inst<Ext extends ObjExt = ObjExt> = { obj: "Inst"; name: string; mod: string[]; params: Params } & Ext["Inst"];
export type Mem<Ext extends ObjExt = ObjExt> = { obj: "Mem"; name: string; variant: "RW" | "RO"; byte: number } & Ext["Mem"];
export type Irq<Ext extends ObjExt = ObjExt> = { obj: "Irq"; name: string; sw_stmts: string[] } & Ext["Irq"];
export type Port<Ext extends ObjExt = ObjExt> = { obj: "Port"; name: string; variant: "In" | "Out" | "InOut" } & Ext["Port"];
export type Reg<Ext extends ObjExt = ObjExt> = { obj: "Reg"; name: string; type: string; init?: number } & Ext["Reg"];
export type Lut<Ext extends ObjExt = ObjExt> = { obj: "Lut"; name: string; input: number; output: number } & Ext["Lut"];
export type Fsm<Ext extends ObjExt = ObjExt> = { obj: "Fsm"; name: string; input: number; state: number } & Ext["Fsm"];
export type Concat<Ext extends ObjExt = ObjExt> = { obj: "Concat"; name: string; input: number[] } & Ext["Concat"];
export type Slice<Ext extends ObjExt = ObjExt> = { obj: "Slice"; name: string; range: [number, number] } & Ext["Slice"];
export type Mux<Ext extends ObjExt = ObjExt> = { obj: "Mux"; name: string; width: number; select: number } & Ext["Mux"];
export type Demux<Ext extends ObjExt = ObjExt> = { obj: "Demux"; name: string; width: number; select: number } & Ext["Demux"];
export type Const<Ext extends ObjExt = ObjExt> = { obj: "Const"; name: string; width: number; value: number } & Ext["Const"];
export type Opr<Ext extends ObjExt = ObjExt> = { obj: "Opr"; name: string; width: number; variant: "AND" | "OR" } & Ext["Opr"];
export type Vmod<Ext extends ObjExt = ObjExt> = {
  obj: "Vmod";
  name: string;
  port: { name: string; direct: "In" | "Out"; width: number; side: "left" | "right" }[];
  body: string;
} & Ext["Vmod"];

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
  Mux: ObjView;
  Demux: ObjView;
  Opr: ObjView;
  Vmod: ObjView;
}
