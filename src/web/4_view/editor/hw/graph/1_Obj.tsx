import { FC, useState } from "react";
import { Inst, Irq, Mem, Obj, Port, Reg } from "~/types";
import { Position, posAdd, posFlip } from "~/utils";
import { Pack } from "~/web/1_type";
import { ObjResolveExt, useColor } from "~/web/2_store";
import { useObj } from "~/web/3_facade";
import { LeftIcon, RightIcon } from "~/web/4_view/atom";

export const ObjView: FC<{ node: Obj<ObjResolveExt> }> = ({ node }) => {
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
  }
};

// --------------------------------------------------------------------------------

const MemView: FC<{ mem: Mem<ObjResolveExt> }> = ({ mem }) => {
  const { onClick, onMouseDown, selected } = useObj(mem);

  return (
    <ObjAtom
      left_ports={mem.variant === "RO" ? [{ name: "out", direct: "out" }] : [{ name: "in", direct: "in" }]}
      right_ports={[]}
      pos={mem.pos}
      flip={false}
      name={mem.name}
      port_name={false}
      width={mem.width}
      highlight={selected}
      onClick={onClick}
      onMouseDown={onMouseDown}
    />
  );
};

const IrqView: FC<{ irq: Irq<ObjResolveExt> }> = ({ irq }) => {
  const { onClick, onMouseDown, key, selected } = useObj(irq);
  return (
    <ObjAtom
      left_ports={[{ name: "in", direct: "in" }]}
      right_ports={[]}
      pos={irq.pos}
      flip={false}
      name={irq.name}
      port_name={false}
      width={irq.width}
      highlight={selected}
      onClick={onClick}
      onMouseDown={onMouseDown}
    />
  );
};

const PortView: FC<{ port: Port<ObjResolveExt> }> = ({ port }) => {
  const { onClick, onMouseDown, key, selected } = useObj(port);
  return (
    <ObjAtom
      left_ports={
        port.variant === "In"
          ? [{ name: "out", direct: "out" }]
          : port.variant === "Out"
            ? [{ name: "in", direct: "in" }]
            : [
                { name: "iosel", direct: "in" },
                { name: "in", direct: "in" },
                { name: "out", direct: "out" },
              ]
      }
      right_ports={[]}
      pos={port.pos}
      flip={false}
      name={port.name}
      port_name={false}
      width={port.width}
      highlight={selected}
      onClick={onClick}
      onMouseDown={onMouseDown}
    />
  );
};

const RegView: FC<{ reg: Reg<ObjResolveExt> }> = ({ reg }) => {
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
        strokeWidth={3}
      />
    </g>
  );
};

const InstView: FC<{ inst: Inst<ObjResolveExt> }> = ({ inst }) => {
  // Global State
  const { onClick, onMouseDown, key, selected } = useObj(inst);
  const color = useColor().editor.hw.graph.obj;

  // Local State
  const [hover, setHover] = useState(false);

  // Calculate
  const [width, height] = inst.pack.size;
  const [ox, oy] = inst.pos;
  const ports = inst.pack.ports;
  const tx = inst.pack.textX;
  const highlight = selected ? selected : hover;

  return (
    <g
      onMouseOver={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ cursor: "pointer" }}
      onClick={onClick}
      onMouseDown={onMouseDown}
    >
      <rect
        x={ox - width / 2}
        y={oy - height / 2}
        width={width}
        height={height}
        stroke={highlight ? color.hov.border : color._.border}
        strokeWidth={2}
        rx={20}
        fill={highlight ? color.hov.fill : color._.fill}
      />
      <text x={inst.flip ? ox - tx : ox + tx} y={oy} fontSize={25} textAnchor="middle" alignmentBaseline="middle">
        {inst.name}
      </text>
      {ports.map((port) => (
        <PortInfo key={port.name} port={port} origin={inst.pos} hover={highlight} flip={inst.flip ?? false} />
      ))}
    </g>
  );
};

// --------------------------------------------------------------------------------

const getTextStyle = (lhs: number, rhs: number) => {
  if (lhs === 0 && rhs > 0) return "left";
  if (lhs > 0 && rhs === 0) return "right";
  return "center";
};

const ObjAtom: FC<{
  left_ports: { name: string; direct: "in" | "out" }[];
  right_ports: { name: string; direct: "in" | "out" }[];
  name: string;
  pos: Position;
  flip: boolean;
  port_name: boolean;
  width: number;
  highlight: boolean;
  onClick: (_: any) => any;
  onMouseDown: (_: any) => any;
}> = ({ left_ports, right_ports, name, pos, port_name, width, highlight, onClick, onMouseDown }) => {
  // Global State
  const color = useColor().editor.hw.graph.obj;

  // Local State
  const [hover, setHover] = useState(false);

  // Calculate
  const height = Math.max(left_ports.length, right_ports.length) * 40 - 6;
  const text_style = getTextStyle(left_ports.length, right_ports.length);
  const [ox, oy] = pos;
  const _color = highlight || hover ? color.hov : color._;

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
      {text_style === "center" && (
        <text x={ox} y={oy} fontSize={25} textAnchor="middle" alignmentBaseline="middle">
          {name}
        </text>
      )}
      {text_style === "right" && (
        <text x={ox + width / 2 - 20} y={oy} fontSize={25} textAnchor="end" alignmentBaseline="middle">
          {name}
        </text>
      )}
      {text_style === "left" && (
        <text x={ox - width / 2 + 20} y={oy} fontSize={25} textAnchor="start" alignmentBaseline="middle">
          {name}
        </text>
      )}
      {left_ports.map(({ name, direct }, i, arr) => (
        <ObjPort
          side="left"
          name={port_name ? name : ""}
          direct={direct}
          pos={posAdd(pos, [-width / 2 + 17, (i - (arr.length - 1) / 2) * 40])}
          hov={hover}
        />
      ))}
      {right_ports.map(({ name, direct }, i, arr) => (
        <ObjPort
          side="right"
          name={port_name ? name : ""}
          direct={direct}
          pos={posAdd(pos, [width / 2 - 17, (i - (arr.length - 1) / 2) * 40])}
          hov={hover}
        />
      ))}
    </g>
  );
};

const ObjPort: FC<{ name: string; pos: Position; direct: "in" | "out"; side: "left" | "right"; hov: boolean }> = ({
  name,
  pos,
  direct,
  side,
  hov,
}) => {
  const TEXT_OFFSET = 17;
  const color = useColor().editor.hw.graph.obj;
  const [cx, cy] = pos;
  const _color = hov ? color.hov : color._;
  return (
    <>
      <circle cx={cx} cy={cy} r={14} fill={_color.port_bg} />
      {(direct === "in") === (side === "left") ? (
        <RightIcon cx={cx} cy={cy} color={_color.port_icon} />
      ) : (
        <LeftIcon cx={cx} cy={cy} color={_color.port_icon} />
      )}
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

const PortInfo: FC<{ port: Pack["ports"][number]; origin: Position; hover: boolean; flip: boolean }> = ({ port, origin, hover, flip }) => {
  const textOffset = 35;
  const side = port.pos[0] > 0 !== flip;
  const color = useColor().editor.hw.graph.obj;
  const [x, y] = posAdd(origin, flip ? posFlip(port.pos) : port.pos);
  const io = port.direct === "input";
  const [cx, cy] = side ? [x - 18, y] : [x + 18, y];
  return (
    <>
      <circle cx={cx} cy={cy} r={14} fill={hover ? color.hov.port_bg : color._.port_bg} />
      {side === io ? <LeftIcon cx={cx} cy={cy} color={color._.port_icon} /> : <RightIcon cx={cx} cy={cy} color={color._.port_icon} />}
      <text x={side ? x - textOffset : x + textOffset} y={y} fontSize={18} textAnchor={side ? "end" : "start"} alignmentBaseline="middle">
        {port.name}
      </text>
    </>
  );
};
