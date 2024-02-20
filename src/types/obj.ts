export interface ObjExt {
  Inst: object;
  Mem: object;
  Irq: object;
  Port: object;
  Reg: object;
}

export type Obj<Ext extends ObjExt = ObjExt> = Inst<Ext> | Mem<Ext> | Irq<Ext> | Port<Ext> | Reg<Ext>;

export type Inst<Ext extends ObjExt = ObjExt> = { obj: "Inst"; name: string; mod: string[]; params: Params } & Ext["Inst"];
export type Mem<Ext extends ObjExt = ObjExt> = { obj: "Mem"; name: string; variant: "RW" | "RO"; byte: number } & Ext["Mem"];
export type Irq<Ext extends ObjExt = ObjExt> = { obj: "Irq"; name: string; sw_stmts: string[] } & Ext["Irq"];
export type Port<Ext extends ObjExt = ObjExt> = { obj: "Port"; name: string; variant: "In" | "Out" | "InOut" } & Ext["Port"];
export type Reg<Ext extends ObjExt = ObjExt> = { obj: "Reg"; name: string; type: string; init?: number } & Ext["Reg"];
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
}
