import {
  AccessTime,
  Code,
  DataArray,
  DataObject,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  Memory,
  Numbers,
  Percent,
  PriorityHigh,
  SvgIconComponent,
} from "@mui/icons-material";
import { FC, useState } from "react";
import { useRecoilState } from "recoil";
import { States, hwEditorFSM, useColor } from "~/web/2_store";
import { Center, css } from "~/web/4_view/atom";
import { Obj } from "~/types";

// Primitive Elements

const DOC_JA = {
  In: "入力ピン",
  Out: "出力ピン",
  InOut: "入出力ピン",
  Irq: "割り込みトリガ",
  MemRO: "読み取り専用メモリ",
  MemRW: "メモリ",
  Reg: "フリップフロップ",
  Slice: "分割",
  Concat: "連結",
  Const: "定数",
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
  Slice: "Slice Wire",
  Concat: "Concat Wire",
  Const: "Const",
  Vmod: "Verilog Module",
};
const DOC = DOC_EN;

export const PrimPane: FC = () => {
  const color = useColor().editor.hw.pane._;

  return (
    <div style={{ ...css.colGrid({ column: [40, "auto", "2fr"], row: 40 }), overflowY: "scroll", background: color.bg, color: color.text }}>
      <In txt={DOC["In"]} Icon={KeyboardArrowRight} />
      <Out txt={DOC["Out"]} Icon={KeyboardArrowLeft} />
      <InOut txt={DOC["InOut"]} Icon={Code} />
      <Irq txt={DOC["Irq"]} Icon={PriorityHigh} />
      <MemRO txt={DOC["MemRO"]} Icon={Numbers} />
      <MemRW txt={DOC["MemRW"]} Icon={Numbers} />
      <Reg txt={DOC["Reg"]} Icon={AccessTime} />
      <Reg txt={DOC["Slice"]} Icon={DataArray} />
      <Reg txt={DOC["Concat"]} Icon={DataObject} />
      <Reg txt={DOC["Const"]} Icon={Percent} />
      <Reg txt={DOC["Vmod"]} Icon={Memory} />
    </div>
  );
};

const In: FC<{ txt: string; Icon: SvgIconComponent }> = ({ txt, Icon }) => {
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

const Out: FC<{ txt: string; Icon: SvgIconComponent }> = ({ txt, Icon }) => {
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

const InOut: FC<{ txt: string; Icon: SvgIconComponent }> = ({ txt, Icon }) => {
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
      selValue={{ obj: "Reg", name: "reg0", type: "0" }}
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
        if (nameSel.type === "input" && name !== "") setState({ state: "AddNode", value: selValue });
        else setState({ state: "AddNode", value: selValue });
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
