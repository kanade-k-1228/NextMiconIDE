import {
  AccessTime,
  Code,
  DataArray,
  DataObject,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  Numbers,
  Percent,
  PriorityHigh,
  SvgIconComponent,
} from "@mui/icons-material";
import { FC, useState } from "react";
import { useRecoilState } from "recoil";
import { States, hwEditorFSM, useColor } from "~/web/2_store";
import { Center, css } from "~/web/4_view/atom";
import { Node } from "~/types";

const primitives = [
  { node: "Io", type: "in", nameSel: "select", Icon: KeyboardArrowRight },
  { node: "Io", type: "out", nameSel: "select", Icon: KeyboardArrowLeft },
  { node: "Io", type: "inout", nameSel: "select", Icon: Code },
  { node: "Irq", type: "irq", nameSel: "select", Icon: PriorityHigh },
  { node: "Reg", type: "in_reg", nameSel: "input", Icon: Numbers },
  { node: "Reg", type: "out_reg", nameSel: "input", Icon: Numbers },
  // { type: "dff", nameSel: "none", Icon: AccessTime },
  // { type: "slice", nameSel: "none", Icon: DataArray },
  // { type: "concat", nameSel: "none", Icon: DataObject },
  // { type: "const", nameSel: "none", Icon: Percent },
  // { type: "verilog", nameSel: "none", Icon: Code },
] as { node: Node["node"]; type: string; nameSel: "select" | "input" | "none"; Icon: SvgIconComponent }[];

const DOC_JA = {
  in: "入力ピン",
  out: "出力ピン",
  inout: "入出力ピン",
  irq: "割り込みトリガ",
  memro: "読み取り専用メモリ",
  memrw: "メモリ",
  reg: "フリップフロップ",
};
const DOC_EN = {
  in: "Input Pin",
  out: "Output Pin",
  inout: "In&Out Pin",
  irq: "Interruption Request",
  memro: "Read Only Reg",
  memrw: "Read&Write Reg",
  reg: "DFF Registor",
};
const DOC = DOC_JA;

export const PrimPane: FC = () => {
  const color = useColor().editor.hw.pane._;

  return (
    <div style={{ ...css.colGrid({ column: [40, "auto", "2fr"], row: 40 }), overflowY: "scroll", background: color.bg, color: color.text }}>
      <In txt={DOC["in"]} Icon={KeyboardArrowRight} />
      <Out txt={DOC["out"]} Icon={KeyboardArrowLeft} />
      <InOut txt={DOC["inout"]} Icon={Code} />
      <Irq txt={DOC["irq"]} Icon={KeyboardArrowRight} />
      <MemRO txt={DOC["memro"]} Icon={Numbers} />
      <MemRW txt={DOC["memrw"]} Icon={Numbers} />
      <Reg txt={DOC["reg"]} Icon={AccessTime} />
    </div>
  );
};

const In: FC<{ txt: string; Icon: SvgIconComponent }> = ({ txt, Icon }) => {
  const [name, setName] = useState("");
  return (
    <PrimSelect
      txt={txt}
      Icon={Icon}
      isSelected={(fsm) => fsm.state === "AddNode" && fsm.value.node === "Io" && fsm.value.direct === "In"}
      name={name}
      nameSel={{ type: "list", list: ["pin1", "pin2", "pin3"] }}
      onNameChange={setName}
      selValue={{ node: "Io", name: name, direct: "In" }}
    />
  );
};

const Out: FC<{ txt: string; Icon: SvgIconComponent }> = ({ txt, Icon }) => {
  const [name, setName] = useState("");
  return (
    <PrimSelect
      txt={txt}
      Icon={Icon}
      isSelected={(fsm) => fsm.state === "AddNode" && fsm.value.node === "Io" && fsm.value.direct === "Out"}
      name={name}
      nameSel={{ type: "list", list: ["pin1", "pin2", "pin3"] }}
      onNameChange={setName}
      selValue={{ node: "Io", name: name, direct: "Out" }}
    />
  );
};

const InOut: FC<{ txt: string; Icon: SvgIconComponent }> = ({ txt, Icon }) => {
  const [name, setName] = useState("");
  return (
    <PrimSelect
      txt={txt}
      Icon={Icon}
      isSelected={(fsm) => fsm.state === "AddNode" && fsm.value.node === "Io" && fsm.value.direct === "InOut"}
      name={name}
      nameSel={{ type: "list", list: ["pin1", "pin2", "pin3"] }}
      onNameChange={setName}
      selValue={{ node: "Io", name: name, direct: "InOut" }}
    />
  );
};

const Irq: FC<{ txt: string; Icon: SvgIconComponent }> = ({ txt, Icon }) => {
  const [name, setName] = useState("");
  return (
    <PrimSelect
      txt={txt}
      Icon={Icon}
      isSelected={(fsm) => fsm.state === "AddNode" && fsm.value.node === "Irq"}
      name={name}
      nameSel={{ type: "list", list: ["irq3", "irq4", "irq5"] }}
      onNameChange={setName}
      selValue={{ node: "Irq", name: name, sw_stmts: [] }}
    />
  );
};

const MemRW: FC<{ txt: string; Icon: SvgIconComponent }> = ({ txt, Icon }) => {
  const [name, setName] = useState("");
  return (
    <PrimSelect
      txt={txt}
      Icon={Icon}
      isSelected={(fsm) => fsm.state === "AddNode" && fsm.value.node === "Mem" && fsm.value.direct === "Write"}
      name={name}
      nameSel={{ type: "none" }}
      onNameChange={setName}
      selValue={{ node: "Mem", direct: "Write", name: name, byte: 1 }}
    />
  );
};

const MemRO: FC<{ txt: string; Icon: SvgIconComponent }> = ({ txt, Icon }) => {
  const [name, setName] = useState("");
  return (
    <PrimSelect
      txt={txt}
      Icon={Icon}
      isSelected={(fsm) => fsm.state === "AddNode" && fsm.value.node === "Mem" && fsm.value.direct === "Read"}
      name={name}
      nameSel={{ type: "none" }}
      onNameChange={setName}
      selValue={{ node: "Mem", direct: "Read", name: name, byte: 1 }}
    />
  );
};

const Reg: FC<{ txt: string; Icon: SvgIconComponent }> = ({ txt, Icon }) => {
  const [name, setName] = useState("");
  return (
    <PrimSelect
      txt={txt}
      Icon={Icon}
      isSelected={(fsm) => fsm.state === "AddNode" && fsm.value.node === "Reg"}
      name={name}
      nameSel={{ type: "none" }}
      onNameChange={setName}
      selValue={{ node: "Reg", name: "reg0", type: "0" }}
    />
  );
};

// --------------------------------------------------------------------------------

const PrimSelect: FC<{
  txt: string;
  nameSel: { type: "list"; list: string[] } | { type: "input" } | { type: "none" };
  name: string;
  Icon: SvgIconComponent;
  selValue: Node;
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
