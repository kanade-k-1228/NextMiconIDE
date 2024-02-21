import { FC, useState } from "react";
import { Inst, Irq, Mem, Obj, ObjViewExt, Port, Reg, Vmod } from "~/types";
import { Position, posAdd, posFlip } from "~/utils";
import { Pack } from "~/web/1_type";
import { ObjResolveExt, useColor } from "~/web/2_store";
import { useObj } from "~/web/3_facade";
import { ExclamationIcon, LeftIcon, QuestionIcon, RightIcon } from "~/web/4_view/atom";

export const ObjView: FC<{ node: Obj<ObjViewExt & ObjResolveExt> }> = ({ node }) => {
  switch (node.obj) {
    case "Inst":
      return <InstView inst={node} />;
    case "Mem":
      return <MemView mem={node} />;
    case "Irq":
      return <IrqView irq={node} />;
    case "Port":
      return <PortView port={node} />;
    case "Reg":
      return <RegView reg={node} />;
    default:
      return <></>;
  }
};

// --------------------------------------------------------------------------------

const MemView: FC<{ mem: Mem<ObjViewExt & ObjResolveExt> }> = ({ mem }) => {
  const { onClick, onMouseDown, selected } = useObj(mem);
  return (
    <ObjAtom
      pos={mem.pos}
      flip={mem.flip}
      width={mem.width}
      port_name={false}
      left_ports={mem.left_ports}
      right_ports={mem.right_ports}
      name={mem.name}
      highlight={selected}
      onClick={onClick}
      onMouseDown={onMouseDown}
    />
  );
};

const IrqView: FC<{ irq: Irq<ObjViewExt & ObjResolveExt> }> = ({ irq }) => {
  const { onClick, onMouseDown, key, selected } = useObj(irq);
  return (
    <ObjAtom
      pos={irq.pos}
      flip={irq.flip}
      width={irq.width}
      left_ports={[{ name: "in", direct: "in", icon: "!" }]}
      right_ports={[]}
      port_name={false}
      name={irq.name}
      highlight={selected}
      onClick={onClick}
      onMouseDown={onMouseDown}
    />
  );
};

const PortView: FC<{ port: Port<ObjViewExt & ObjResolveExt> }> = ({ port }) => {
  const { onClick, onMouseDown, key, selected } = useObj(port);
  return (
    <ObjAtom
      pos={port.pos}
      flip={port.flip}
      left_ports={
        port.variant === "In"
          ? [{ name: "out", direct: "out" }]
          : port.variant === "Out"
            ? [{ name: "in", direct: "in" }]
            : [
                { name: "iosel", direct: "in", icon: "?" },
                { name: "in", direct: "in" },
                { name: "out", direct: "out" },
              ]
      }
      right_ports={[]}
      name={port.name}
      port_name={false}
      width={port.width}
      highlight={selected}
      onClick={onClick}
      onMouseDown={onMouseDown}
    />
  );
};

const RegView: FC<{ reg: Reg<ObjViewExt & ObjResolveExt> }> = ({ reg }) => {
  // Global State
  const { onClick, onMouseDown, key, selected } = useObj(reg);
  const color = useColor().editor.hw.graph.obj;

  // Local State
  const [hover, setHover] = useState(false);

  // Calculate
  const [width, height] = [40, 40];
  const [ox, oy] = reg.pos;
  const highlight = selected ? selected : hover;

  const CLOCK = [
    [10, 40],
    [20, 25],
    [30, 40],
  ] as const;

  return (
    <g
      onMouseOver={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ cursor: "pointer" }}
      onClick={onClick}
      onMouseDown={onMouseDown}
    >
      <rect
        x={ox}
        y={oy}
        rx={5}
        width={width}
        height={height}
        stroke={highlight ? color.hov.border : color._.border}
        strokeWidth={2}
        fill={highlight ? color.hov.fill : color._.fill}
      />
      <polyline
        stroke={highlight ? color._.fill : color._.border}
        points={CLOCK.map(([x, y]) => `${ox + x},${oy + y}`).join(" ")}
        fill="none"
        strokeLinejoin="round"
        strokeWidth={3}
      />
    </g>
  );
};

const InstView: FC<{ inst: Inst<ObjViewExt & ObjResolveExt> }> = ({ inst }) => {
  const { onClick, onMouseDown, selected } = useObj(inst);
  return (
    <ObjAtom
      pos={inst.pos}
      flip={inst.flip}
      left_ports={inst.left_ports}
      right_ports={inst.right_ports}
      name={inst.name}
      port_name={true}
      width={inst.width}
      highlight={selected}
      onClick={onClick}
      onMouseDown={onMouseDown}
    />
  );
};

const VmodView: FC<{ vmod: Vmod<ObjViewExt & ObjResolveExt> }> = ({ vmod }) => {
  const { onClick, onMouseDown, selected } = useObj(vmod);
  return (
    <ObjAtom
      pos={vmod.pos}
      flip={vmod.flip}
      left_ports={vmod.left_ports}
      right_ports={vmod.right_ports}
      name={vmod.name}
      port_name={true}
      width={vmod.width}
      highlight={selected}
      onClick={onClick}
      onMouseDown={onMouseDown}
    />
  );
};

// --------------------------------------------------------------------------------

const getTextAlign = (lhs: number, rhs: number, flip: boolean) => {
  if (lhs === 0 && rhs > 0) return flip ? "right" : "left";
  if (lhs > 0 && rhs === 0) return flip ? "left" : "right";
  return "center";
};

const ObjAtom: FC<{
  left_ports: { name: string; direct: "in" | "out"; icon?: PortIcon }[];
  right_ports: { name: string; direct: "in" | "out"; icon?: PortIcon }[];
  name: string;
  pos: Position;
  flip: boolean;
  port_name: boolean;
  width: number;
  highlight: boolean;
  onClick: (_: any) => any;
  onMouseDown: (_: any) => any;
}> = ({ left_ports, right_ports, name, pos, flip, port_name, width, highlight, onClick, onMouseDown }) => {
  // Global State
  const color = useColor().editor.hw.graph.obj;

  // Local State
  const [hover, setHover] = useState(false);

  // Calculate
  const height = Math.max(left_ports.length, right_ports.length) * 40 - 6;
  const text_align = getTextAlign(left_ports.length, right_ports.length, flip);
  const [ox, oy] = pos;
  const _color = highlight || hover ? color.hov : color._;
  const lp = flip ? right_ports : left_ports;
  const rp = flip ? left_ports : right_ports;

  return (
    <g
      onMouseOver={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
      onMouseDown={onMouseDown}
      style={{ cursor: "pointer" }}
    >
      <rect
        x={ox - width / 2}
        y={oy - height / 2}
        width={width}
        height={height}
        stroke={_color.border}
        strokeWidth={2}
        rx={17}
        fill={_color.fill}
      />
      {text_align === "center" && (
        <text x={ox} y={oy} fontSize={25} textAnchor="middle" alignmentBaseline="middle">
          {name}
        </text>
      )}
      {text_align === "right" && (
        <text x={ox + width / 2 - 20} y={oy} fontSize={25} textAnchor="end" alignmentBaseline="middle">
          {name}
        </text>
      )}
      {text_align === "left" && (
        <text x={ox - width / 2 + 20} y={oy} fontSize={25} textAnchor="start" alignmentBaseline="middle">
          {name}
        </text>
      )}
      {lp.map(({ name, direct, icon }, i, arr) => (
        <ObjPort
          key={name}
          side="left"
          name={port_name ? name : ""}
          direct={direct}
          pos={posAdd(pos, [-width / 2 + 17, (i - (arr.length - 1) / 2) * 40])}
          hov={hover}
          icon={icon}
        />
      ))}
      {rp.map(({ name, direct, icon }, i, arr) => (
        <ObjPort
          key={name}
          side="right"
          name={port_name ? name : ""}
          direct={direct}
          pos={posAdd(pos, [width / 2 - 17, (i - (arr.length - 1) / 2) * 40])}
          hov={hover}
          icon={icon}
        />
      ))}
    </g>
  );
};

type PortIcon = "?" | "!" | ">" | "<";

const ObjPort: FC<{ name: string; pos: Position; direct: "in" | "out"; side: "left" | "right"; hov: boolean; icon?: PortIcon }> = ({
  name,
  pos,
  direct,
  side,
  hov,
  icon,
}) => {
  const TEXT_OFFSET = 17;
  const color = useColor().editor.hw.graph.obj;
  const [cx, cy] = pos;
  const _color = hov ? color.hov : color._;
  const _icon: PortIcon = icon ?? ((direct === "in") === (side === "left") ? ">" : "<");
  return (
    <>
      <circle cx={cx} cy={cy} r={14} fill={_color.port_bg} />
      {_icon === ">" && <RightIcon cx={cx} cy={cy} color={_color.port_icon} />}
      {_icon === "<" && <LeftIcon cx={cx} cy={cy} color={_color.port_icon} />}
      {_icon === "?" && <QuestionIcon cx={cx} cy={cy} color={_color.port_icon} />}
      {_icon === "!" && <ExclamationIcon cx={cx} cy={cy} color={_color.port_icon} />}
      <text
        x={side === "left" ? cx + TEXT_OFFSET : cx - TEXT_OFFSET}
        y={cy}
        fontSize={18}
        textAnchor={side === "left" ? "start" : "end"}
        alignmentBaseline="middle"
      >
        {name}
      </text>
    </>
  );
};
