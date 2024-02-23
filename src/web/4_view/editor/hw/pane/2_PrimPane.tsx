import {
  AccessTime,
  Add,
  Code,
  DataArray,
  DataObject,
  FormatListNumbered,
  JoinFull,
  JoinFullOutlined,
  JoinInner,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  Memory,
  Numbers,
  Percent,
  PriorityHigh,
  QuestionAnswer,
  QuestionMark,
  Share,
  SvgIconComponent,
} from "@mui/icons-material";
import { FC, useState } from "react";
import { useRecoilState } from "recoil";
import { Obj } from "~/types";
import { States, hwEditorFSM, useColor } from "~/web/2_store";
import { Center, css } from "~/web/4_view/atom";

// Primitive Elements

const DOC_JA = {
  In: "入力ピン",
  Out: "出力ピン",
  InOut: "入出力ピン",
  Irq: "割り込みトリガ",
  MemRO: "入力レジスタ",
  MemRW: "出力レジスタ",
  Reg: "フリップフロップ",
  Lut: "真理値表",
  Fsm: "有限状態機械",
  Slice: "配線の分割",
  Concat: "配線の連結",
  Const: "定数値",
  Mux: "マルチプレクサ",
  Demux: "デマルチプレクサ",
  Bit: "ビット演算",
  Arith: "算術演算",
  Vmod: "Verilogモジュール",
};
const DOC_EN = {
  In: "Input Pin",
  Out: "Output Pin",
  InOut: "In & Out Pin",
  Irq: "Interruption Request",
  MemRO: "Read Only Reg",
  MemRW: "Read & Write Reg",
  Reg: "DFF Registor",
  Lut: "Look up table",
  Fsm: "Finite State Machine",
  Slice: "Slice Wire",
  Concat: "Concat Wire",
  Const: "Const Value",
  Vmod: "Verilog Module",
};
const DOC = DOC_JA;

export const PrimPane: FC = () => {
  const color = useColor().editor.hw.pane._;
  return (
    <div style={{ ...css.colGrid({ column: [40, "auto", null], row: 40 }), overflowY: "scroll", background: color.bg, color: color.text }}>
      <PortIn txt={DOC["In"]} Icon={KeyboardArrowLeft} />
      <PortOut txt={DOC["Out"]} Icon={KeyboardArrowRight} />
      <PortInOut txt={DOC["InOut"]} Icon={Code} />
      <Irq txt={DOC["Irq"]} Icon={PriorityHigh} />
      <MemRO txt={DOC["MemRO"]} Icon={Numbers} />
      <MemRW txt={DOC["MemRW"]} Icon={Numbers} />
      <Reg txt={DOC["Reg"]} Icon={AccessTime} />
      <Lut txt={DOC["Lut"]} Icon={FormatListNumbered} />
      <Fsm txt={DOC["Fsm"]} Icon={Share} />
      <Slice txt={DOC["Slice"]} Icon={DataArray} />
      <Concat txt={DOC["Concat"]} Icon={DataObject} />
      <Const txt={DOC["Const"]} Icon={Percent} />
      <Vmod txt={DOC["Bit"]} Icon={JoinInner} />
      <Vmod txt={DOC["Arith"]} Icon={Add} />
      <Mux txt={DOC["Mux"]} Icon={QuestionMark} />
      <Demux txt={DOC["Demux"]} Icon={QuestionMark} />
      <Vmod txt={DOC["Vmod"]} Icon={Memory} />
    </div>
  );
};

const PortIn: FC<{ txt: string; Icon: SvgIconComponent }> = ({ txt, Icon }) => {
  const [name, setName] = useState("");
  return (
    <PrimSelect
      txt={txt}
      Icon={Icon}
      isSelected={(fsm) => fsm.state === "AddNode" && fsm.value.obj === "Port" && fsm.value.variant === "In"}
      name={name}
      nameSel={{ type: "list", list: ["pin1", "pin2", "pin3"] }}
      onNameChange={setName}
      selValue={{ obj: "Port", name: name, variant: "In" }}
    />
  );
};

const PortOut: FC<{ txt: string; Icon: SvgIconComponent }> = ({ txt, Icon }) => {
  const [name, setName] = useState("");
  return (
    <PrimSelect
      txt={txt}
      Icon={Icon}
      isSelected={(fsm) => fsm.state === "AddNode" && fsm.value.obj === "Port" && fsm.value.variant === "Out"}
      name={name}
      nameSel={{ type: "list", list: ["pin1", "pin2", "pin3"] }}
      onNameChange={setName}
      selValue={{ obj: "Port", name: name, variant: "Out" }}
    />
  );
};

const PortInOut: FC<{ txt: string; Icon: SvgIconComponent }> = ({ txt, Icon }) => {
  const [name, setName] = useState("");
  return (
    <PrimSelect
      txt={txt}
      Icon={Icon}
      isSelected={(fsm) => fsm.state === "AddNode" && fsm.value.obj === "Port" && fsm.value.variant === "InOut"}
      name={name}
      nameSel={{ type: "list", list: ["pin1", "pin2", "pin3"] }}
      onNameChange={setName}
      selValue={{ obj: "Port", name: name, variant: "InOut" }}
    />
  );
};

const Irq: FC<{ txt: string; Icon: SvgIconComponent }> = ({ txt, Icon }) => {
  const [name, setName] = useState("");
  return (
    <PrimSelect
      txt={txt}
      Icon={Icon}
      isSelected={(fsm) => fsm.state === "AddNode" && fsm.value.obj === "Irq"}
      name={name}
      nameSel={{ type: "list", list: ["irq3", "irq4", "irq5"] }}
      onNameChange={setName}
      selValue={{ obj: "Irq", name: name, sw_stmts: [] }}
    />
  );
};

const MemRW: FC<{ txt: string; Icon: SvgIconComponent }> = ({ txt, Icon }) => {
  const [name, setName] = useState("");
  return (
    <PrimSelect
      txt={txt}
      Icon={Icon}
      isSelected={(fsm) => fsm.state === "AddNode" && fsm.value.obj === "Mem" && fsm.value.variant === "RW"}
      name={name}
      nameSel={{ type: "none" }}
      onNameChange={setName}
      selValue={{ obj: "Mem", variant: "RW", name: name, byte: 1 }}
    />
  );
};

const MemRO: FC<{ txt: string; Icon: SvgIconComponent }> = ({ txt, Icon }) => {
  const [name, setName] = useState("");
  return (
    <PrimSelect
      txt={txt}
      Icon={Icon}
      isSelected={(fsm) => fsm.state === "AddNode" && fsm.value.obj === "Mem" && fsm.value.variant === "RO"}
      name={name}
      nameSel={{ type: "none" }}
      onNameChange={setName}
      selValue={{ obj: "Mem", variant: "RO", name: name, byte: 1 }}
    />
  );
};

const Reg: FC<{ txt: string; Icon: SvgIconComponent }> = ({ txt, Icon }) => {
  const [name, setName] = useState("");
  return (
    <PrimSelect
      txt={txt}
      Icon={Icon}
      isSelected={(fsm) => fsm.state === "AddNode" && fsm.value.obj === "Reg"}
      name={name}
      nameSel={{ type: "none" }}
      onNameChange={setName}
      selValue={{ obj: "Reg", name: "reg0", bit: 1 }}
    />
  );
};

const Lut: FC<{ txt: string; Icon: SvgIconComponent }> = ({ txt, Icon }) => {
  const [name, setName] = useState("");
  return (
    <PrimSelect
      txt={txt}
      Icon={Icon}
      isSelected={(fsm) => fsm.state === "AddNode" && fsm.value.obj === "Lut"}
      name={name}
      nameSel={{ type: "none" }}
      onNameChange={setName}
      selValue={{ obj: "Lut", name: "lut0", in_bit: 2, out_bit: 1 }}
    />
  );
};

const Fsm: FC<{ txt: string; Icon: SvgIconComponent }> = ({ txt, Icon }) => {
  const [name, setName] = useState("");
  return (
    <PrimSelect
      txt={txt}
      Icon={Icon}
      isSelected={(fsm) => fsm.state === "AddNode" && fsm.value.obj === "Fsm"}
      name={name}
      nameSel={{ type: "none" }}
      onNameChange={setName}
      selValue={{ obj: "Fsm", name: "fsm0", in_bit: 4, state: 4 }}
    />
  );
};

const Slice: FC<{ txt: string; Icon: SvgIconComponent }> = ({ txt, Icon }) => {
  const [name, setName] = useState("");
  return (
    <PrimSelect
      txt={txt}
      Icon={Icon}
      isSelected={(fsm) => fsm.state === "AddNode" && fsm.value.obj === "Slice"}
      name={name}
      nameSel={{ type: "none" }}
      onNameChange={setName}
      selValue={{ obj: "Slice", name: "slice0", range: [0, 0] }}
    />
  );
};

const Concat: FC<{ txt: string; Icon: SvgIconComponent }> = ({ txt, Icon }) => {
  const [name, setName] = useState("");
  return (
    <PrimSelect
      txt={txt}
      Icon={Icon}
      isSelected={(fsm) => fsm.state === "AddNode" && fsm.value.obj === "Concat"}
      name={name}
      nameSel={{ type: "none" }}
      onNameChange={setName}
      selValue={{ obj: "Concat", name: "concat0", in_bits: [1, 1] }}
    />
  );
};

const Const: FC<{ txt: string; Icon: SvgIconComponent }> = ({ txt, Icon }) => {
  const [name, setName] = useState("");
  return (
    <PrimSelect
      txt={txt}
      Icon={Icon}
      isSelected={(fsm) => fsm.state === "AddNode" && fsm.value.obj === "Const"}
      name={name}
      nameSel={{ type: "none" }}
      onNameChange={setName}
      selValue={{ obj: "Const", name: "const0", val: 0, bit: 1 }}
    />
  );
};

const Mux: FC<{ txt: string; Icon: SvgIconComponent }> = ({ txt, Icon }) => {
  const [name, setName] = useState("");
  return (
    <PrimSelect
      txt={txt}
      Icon={Icon}
      isSelected={(fsm) => fsm.state === "AddNode" && fsm.value.obj === "Mux"}
      name={name}
      nameSel={{ type: "none" }}
      onNameChange={setName}
      selValue={{ obj: "Mux", name: "mux0", sel: 2, bit: 1 }}
    />
  );
};

const Demux: FC<{ txt: string; Icon: SvgIconComponent }> = ({ txt, Icon }) => {
  const [name, setName] = useState("");
  return (
    <PrimSelect
      txt={txt}
      Icon={Icon}
      isSelected={(fsm) => fsm.state === "AddNode" && fsm.value.obj === "Demux"}
      name={name}
      nameSel={{ type: "none" }}
      onNameChange={setName}
      selValue={{ obj: "Demux", name: "demux0", sel: 2, bit: 1 }}
    />
  );
};

const Vmod: FC<{ txt: string; Icon: SvgIconComponent }> = ({ txt, Icon }) => {
  const [name, setName] = useState("");
  return (
    <PrimSelect
      txt={txt}
      Icon={Icon}
      isSelected={(fsm) => fsm.state === "AddNode" && fsm.value.obj === "Vmod"}
      name={name}
      nameSel={{ type: "none" }}
      onNameChange={setName}
      selValue={{
        obj: "Vmod",
        name: "vmod0",
        body: "",
        port: [
          { name: "clk", direct: "in", type: "w1", bit: 1, side: "left" },
          { name: "in", direct: "in", type: "w1", bit: 1, side: "left" },
          { name: "out", direct: "out", type: "w1", bit: 1, side: "right" },
          { name: "ready", direct: "out", type: "w1", bit: 1, side: "right" },
          { name: "ack", direct: "in", type: "w1", bit: 1, side: "right" },
        ],
      }}
    />
  );
};

// --------------------------------------------------------------------------------

const PrimSelect: FC<{
  txt: string;
  nameSel: { type: "list"; list: string[] } | { type: "input" } | { type: "none" };
  name: string;
  Icon: SvgIconComponent;
  selValue: Obj;
  isSelected: (state: States) => boolean;
  onNameChange: (s: string) => void;
}> = ({ isSelected, txt, nameSel, name, Icon, selValue, onNameChange }) => {
  // Global State
  const [fsm, setState] = useRecoilState(hwEditorFSM);
  const color = useColor().editor.hw.pane.item;

  // Local State
  const [hover, setHover] = useState(false);

  // Calculate
  const selected = isSelected(fsm);
  const _color = selected ? color.sel : hover ? color.hov : color._;

  return (
    <div
      style={{ ...css.colSubGrid, cursor: "pointer", background: _color.bg, color: _color.text }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => {
        switch (nameSel.type) {
          case "list":
          case "input": {
            if (name !== "") {
              setState({ state: "AddNode", value: selValue });
            }
            return;
          }
          case "none":
            setState({ state: "AddNode", value: selValue });
            return;
        }
      }}
    >
      <Center>
        <Icon style={{ height: 30, width: 30, color: _color.icon }} />
      </Center>
      <div style={{ ...css.left, fontSize: 20, whiteSpace: "nowrap" }}>{txt}</div>
      <div style={{ padding: 5 }}>
        {nameSel.type === "list" && (
          <select
            style={{
              height: "100%",
              width: "100%",
              outline: "none",
              borderWidth: 1.5,
              borderRadius: 4,
              cursor: "pointer",
              background: _color.bg,
              color: _color.text,
            }}
            onChange={(e) => onNameChange(e.target.value)}
            value={name}
          >
            <option></option>
            {nameSel.list.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        )}
        {nameSel.type === "input" && (
          <input
            style={{
              height: "100%",
              width: "100%",
              outline: "none",
              borderWidth: 1.5,
              borderRadius: 4,
              borderStyle: "solid",
              boxSizing: "inherit",
              background: _color.bg,
              color: _color.text,
            }}
            onChange={(e) => onNameChange(e.target.value)}
            value={name}
          />
        )}
      </div>
    </div>
  );
};
