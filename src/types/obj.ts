import { PackPort } from "~/files";

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
export type Reg<Ext extends ObjExt = ObjExt> = { obj: "Reg"; name: string; bit: number; init?: number } & Ext["Reg"];
export type Lut<Ext extends ObjExt = ObjExt> = { obj: "Lut"; name: string; in_bit: number; out_bit: number } & Ext["Lut"];
export type Fsm<Ext extends ObjExt = ObjExt> = { obj: "Fsm"; name: string; in_bit: number; state: number } & Ext["Fsm"];
export type Concat<Ext extends ObjExt = ObjExt> = { obj: "Concat"; name: string; in_bits: number[] } & Ext["Concat"];
export type Slice<Ext extends ObjExt = ObjExt> = { obj: "Slice"; name: string; range: [number, number] } & Ext["Slice"];
export type Mux<Ext extends ObjExt = ObjExt> = { obj: "Mux"; name: string; bit: number; sel: number } & Ext["Mux"];
export type Demux<Ext extends ObjExt = ObjExt> = { obj: "Demux"; name: string; bit: number; sel: number } & Ext["Demux"];
export type Const<Ext extends ObjExt = ObjExt> = { obj: "Const"; name: string; bit: number; val: number } & Ext["Const"];
export type Opr<Ext extends ObjExt = ObjExt> = { obj: "Opr"; name: string; type: number; variant: "AND" | "OR" } & Ext["Opr"];
export type Vmod<Ext extends ObjExt = ObjExt> = {
  obj: "Vmod";
  name: string;
  port: (PackPort & { side: "left" | "right" })[];
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
