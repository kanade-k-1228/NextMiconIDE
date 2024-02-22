import { FC, useState } from "react";
import { Const, Inst, Irq, Mem, Obj, ObjViewExt, Port, Reg, Vmod } from "~/types";
import { Position, posAdd, posFlip } from "~/utils";
import { ObjResolveExt, useColor } from "~/web/2_store";
import { useObj } from "~/web/3_facade";
import { ExclamationIcon, LeftIcon, QuestionIcon, RightIcon } from "~/web/4_view/atom";

export const ObjView: FC<{ obj: Obj<ObjViewExt & ObjResolveExt> }> = ({ obj }) => {
  switch (obj.obj) {
    case "Inst":
      return <InstView obj={obj} />;
    case "Mem":
      return <MemView obj={obj} />;
    case "Irq":
      return <IrqView obj={obj} />;
    case "Port":
      return <PortView obj={obj} />;
    case "Reg":
      return <RegView obj={obj} />;
    case "Const":
      return <ConstView obj={obj} />;
    case "Vmod":
      return <VmodView obj={obj} />;
    default:
      return <></>;
  }
};

// --------------------------------------------------------------------------------

const MemView: FC<{ obj: Mem<ObjViewExt & ObjResolveExt> }> = ({ obj }) => {
  const { onClick, onMouseDown, selected } = useObj(obj);
  return (
    <ObjAtom
      pos={obj.pos}
      flip={obj.flip}
      width={obj.width}
      port_name={false}
      left_ports={obj.left_ports}
      right_ports={obj.right_ports}
      name={obj.name}
      highlight={selected}
      onClick={onClick}
      onMouseDown={onMouseDown}
    />
  );
};

const IrqView: FC<{ obj: Irq<ObjViewExt & ObjResolveExt> }> = ({ obj }) => {
  const { onClick, onMouseDown, key, selected } = useObj(obj);
  return (
    <ObjAtom
      pos={obj.pos}
      flip={obj.flip}
      width={obj.width}
      left_ports={[{ name: "in", direct: "in", icon: "!" }]}
      right_ports={[]}
      port_name={false}
      name={obj.name}
      highlight={selected}
      onClick={onClick}
      onMouseDown={onMouseDown}
    />
  );
};

const PortView: FC<{ obj: Port<ObjViewExt & ObjResolveExt> }> = ({ obj }) => {
  const { onClick, onMouseDown, key, selected } = useObj(obj);
  return (
    <ObjAtom
      pos={obj.pos}
      flip={obj.flip}
      left_ports={obj.left_ports}
      right_ports={obj.right_ports}
      name={obj.name}
      port_name={false}
      width={obj.width}
      highlight={selected}
      onClick={onClick}
      onMouseDown={onMouseDown}
    />
  );
};

const RegView: FC<{ obj: Reg<ObjViewExt & ObjResolveExt> }> = ({ obj }) => {
  // Global State
  const { onClick, onMouseDown, key, selected } = useObj(obj);
  const color = useColor().editor.hw.graph.obj;

  // Local State
  const [hover, setHover] = useState(false);

  // Calculate
  const [width, height] = [40, 40];
  const [ox, oy] = obj.pos;
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

const ConstView: FC<{ obj: Const<ObjViewExt & ObjResolveExt> }> = ({ obj }) => {
  const { onClick, onMouseDown, selected } = useObj(obj);
  return (
    <ObjAtom
      pos={obj.pos}
      flip={obj.flip}
      left_ports={obj.left_ports}
      right_ports={obj.right_ports}
      name={obj.value.toString()}
      port_name={false}
      width={obj.width}
      highlight={selected}
      onClick={onClick}
      onMouseDown={onMouseDown}
      radius={5}
    />
  );
};

const InstView: FC<{ obj: Inst<ObjViewExt & ObjResolveExt> }> = ({ obj }) => {
  const { onClick, onMouseDown, selected } = useObj(obj);
  return (
    <ObjAtom
      pos={obj.pos}
      flip={obj.flip}
      left_ports={obj.left_ports}
      right_ports={obj.right_ports}
      name={obj.name}
      port_name={true}
      width={obj.width}
      highlight={selected}
      onClick={onClick}
      onMouseDown={onMouseDown}
    />
  );
};

const VmodView: FC<{ obj: Vmod<ObjViewExt & ObjResolveExt> }> = ({ obj }) => {
  const { onClick, onMouseDown, selected } = useObj(obj);
  return (
    <ObjAtom
      pos={obj.pos}
      flip={obj.flip}
      left_ports={obj.left_ports}
      right_ports={obj.right_ports}
      name={obj.name}
      port_name={true}
      width={obj.width}
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
  radius?: number;
}> = ({ left_ports, right_ports, name, pos, flip, port_name, width, highlight, onClick, onMouseDown, radius = 17 }) => {
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
        rx={radius}
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
  const text_x = side === "left" ? cx + TEXT_OFFSET : cx - TEXT_OFFSET;
  const text_anchor = side === "left" ? "start" : "end";
  return (
    <>
      <circle cx={cx} cy={cy} r={14} fill={_color.port_bg} />
      {_icon === ">" && <RightIcon cx={cx} cy={cy} color={_color.port_icon} />}
      {_icon === "<" && <LeftIcon cx={cx} cy={cy} color={_color.port_icon} />}
      {_icon === "?" && <QuestionIcon cx={cx} cy={cy} color={_color.port_icon} />}
      {_icon === "!" && <ExclamationIcon cx={cx} cy={cy} color={_color.port_icon} />}
      <text x={text_x} y={cy} fontSize={18} textAnchor={text_anchor} alignmentBaseline="middle">
        {name}
      </text>
    </>
  );
};
