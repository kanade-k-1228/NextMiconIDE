export interface NodeExt {
  Inst: object;
  Mem: object;
  Irq: object;
  Io: object;
  Reg: object;
}

export type Node<Ext extends NodeExt = NodeExt> = Inst<Ext> | Mem<Ext> | Irq<Ext> | Io<Ext> | Reg<Ext>;

export type Inst<Ext extends NodeExt = NodeExt> = {
  node: "Inst";
  name: string;
  mod_path: string[];
  params: { name: string; value: string }[];
} & Ext["Inst"];

export type Mem<Ext extends NodeExt = NodeExt> = {
  node: "Mem";
  name: string;
  direct: "Read" | "Write";
  byte: number;
} & Ext["Mem"];

export type Irq<Ext extends NodeExt = NodeExt> = {
  node: "Irq";
  name: string;
  sw_stmts: string[];
} & Ext["Irq"];

export type Io<Ext extends NodeExt = NodeExt> = {
  node: "Io";
  name: string;
  direct: "In" | "Out" | "InOut";
} & Ext["Io"];

export type Reg<Ext extends NodeExt = NodeExt> = {
  node: "Reg";
  name: string;
  type: string;
  init?: number;
} & Ext["Reg"];

// --------------------------------------------------------------------------------
// View

type NodeView = { pos: [number, number]; flip: boolean; width: number };

export interface NodeExtView {
  Inst: NodeView;
  Mem: NodeView;
  Irq: NodeView;
  Io: NodeView;
  Reg: NodeView;
}
