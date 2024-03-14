import { FC, useState } from "react";
import { PackPort } from "~/files";
import { Concat, Const, Demux, Inst, Irq, Mem, Mux, Obj, ObjViewExt, Port, Reg, Slice, Vmod } from "~/types";
import { Position, posAdd, posFlip } from "~/utils";
import { hex } from "~/web/0_common";
import { ObjResolveExt, useColor } from "~/web/2_store";
import { useObj } from "~/web/3_facade";
import { ExclamationIcon, HashIcon, LeftIcon, QuestionIcon, RightIcon } from "~/web/4_view/atom";

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
    case "Concat":
      return <ConcatView obj={obj} />;
    case "Slice":
      return <SliceView obj={obj} />;
    case "Lut":
    case "Fsm":
      return <></>;
    case "Mux":
      return <MuxView obj={obj} />;
    case "Demux":
      return <DemuxView obj={obj} />;
  }
};

// --------------------------------------------------------------------------------

const MemView: FC<{ obj: Mem<ObjViewExt & ObjResolveExt> }> = ({ obj }) => {
  const { onClick, onMouseDown, selected } = useObj(obj);
  return (
    <PrimView
      pos={obj.pos}
      flip={obj.flip}
      width={obj.width}
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
  const { onClick, onMouseDown, selected } = useObj(obj);
  return (
    <PrimView
      pos={obj.pos}
      flip={obj.flip}
      width={obj.width}
      left_ports={obj.left_ports}
      right_ports={obj.right_ports}
      name={obj.name}
      highlight={selected}
      onClick={onClick}
      onMouseDown={onMouseDown}
    />
  );
};

const PortView: FC<{ obj: Port<ObjViewExt & ObjResolveExt> }> = ({ obj }) => {
  const { onClick, onMouseDown, selected } = useObj(obj);
  return (
    <PrimView
      pos={obj.pos}
      flip={obj.flip}
      left_ports={obj.left_ports}
      right_ports={obj.right_ports}
      name={obj.name}
      width={obj.width}
      highlight={selected}
      onClick={onClick}
      onMouseDown={onMouseDown}
    />
  );
};

const RegView: FC<{ obj: Reg<ObjViewExt & ObjResolveExt> }> = ({ obj }) => {
  // Global State
  const { onClick, onMouseDown, selected } = useObj(obj);
  const color = useColor().editor.hw.graph.obj;

  // Local State
  const [hover, setHover] = useState(false);

  // Calculate
  const [width, height] = [obj.width, obj.width];
  const [ox, oy] = obj.pos;
  const highlight = selected ? selected : hover;
  const clk_mark = [
    [-width / 4, width / 2],
    [0, 0],
    [width / 4, width / 2],
  ];

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
        y={oy - width / 2}
        rx={5}
        width={width}
        height={height}
        stroke={highlight ? color.hov.border : color._.border}
        strokeWidth={2}
        fill={highlight ? color.hov.fill : color._.fill}
      />
      <polyline
        stroke={highlight ? color._.fill : color._.border}
        points={clk_mark.map(([x, y]) => `${ox + x},${oy + y}`).join(" ")}
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
    <ModView
      pos={obj.pos}
      flip={obj.flip}
      left_ports={obj.left_ports}
      right_ports={obj.right_ports}
      name={`${obj.bit}'h${hex(obj.val, Math.ceil(obj.bit / 4))}`}
      width={obj.width}
      highlight={selected}
      onClick={onClick}
      onMouseDown={onMouseDown}
    />
  );
};

const InstView: FC<{ obj: Inst<ObjViewExt & ObjResolveExt> }> = ({ obj }) => {
  const { onClick, onMouseDown, selected } = useObj(obj);
  return (
    <ModView
      pos={obj.pos}
      flip={obj.flip}
      left_ports={obj.left_ports}
      right_ports={obj.right_ports}
      name={obj.name}
      width={obj.width}
      highlight={selected}
      onClick={onClick}
      onMouseDown={onMouseDown}
    />
  );
};

const SliceView: FC<{ obj: Slice<ObjViewExt & ObjResolveExt> }> = ({ obj }) => {
  const { onClick, onMouseDown, selected } = useObj(obj);
  return (
    <ModView
      pos={obj.pos}
      flip={obj.flip}
      left_ports={obj.left_ports}
      right_ports={obj.right_ports}
      name={`${obj.range[0]}:${obj.range[1]}`}
      width={obj.width}
      highlight={selected}
      onClick={onClick}
      onMouseDown={onMouseDown}
    />
  );
};

const ConcatView: FC<{ obj: Concat<ObjViewExt & ObjResolveExt> }> = ({ obj }) => {
  const { onClick, onMouseDown, selected } = useObj(obj);
  return (
    <ModView
      pos={obj.pos}
      flip={obj.flip}
      left_ports={obj.left_ports}
      right_ports={obj.right_ports}
      name={""}
      width={obj.width}
      highlight={selected}
      onClick={onClick}
      onMouseDown={onMouseDown}
    />
  );
};

const MuxView: FC<{ obj: Mux<ObjViewExt & ObjResolveExt> }> = ({ obj }) => {
  const { onClick, onMouseDown, selected } = useObj(obj);
  return (
    <ModView
      pos={obj.pos}
      flip={obj.flip}
      left_ports={obj.left_ports}
      right_ports={obj.right_ports}
      name={obj.name}
      width={obj.width}
      highlight={selected}
      onClick={onClick}
      onMouseDown={onMouseDown}
    />
  );
};

const DemuxView: FC<{ obj: Demux<ObjViewExt & ObjResolveExt> }> = ({ obj }) => {
  const { onClick, onMouseDown, selected } = useObj(obj);
  return (
    <ModView
      pos={obj.pos}
      flip={obj.flip}
      left_ports={obj.left_ports}
      right_ports={obj.right_ports}
      name={obj.name}
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
    <ModView
      pos={obj.pos}
      flip={obj.flip}
      left_ports={obj.left_ports}
      right_ports={obj.right_ports}
      name={obj.name}
      width={obj.width}
      highlight={selected}
      onClick={onClick}
      onMouseDown={onMouseDown}
    />
  );
};

// --------------------------------------------------------------------------------

const ModView: FC<{
  left_ports: PackPort[];
  right_ports: PackPort[];
  name: string;
  pos: Position;
  flip: boolean;
  width: number;
  highlight: boolean;
  onClick: (_: any) => any;
  onMouseDown: (_: any) => any;
}> = ({ left_ports, right_ports, name, pos, flip, width, highlight, onClick, onMouseDown }) => {
  // Global State
  const color = useColor().editor.hw.graph.obj;

  // Local State
  const [hover, setHover] = useState(false);

  // Calculate
  const height = Math.max(left_ports.length, right_ports.length) * 40 - 6;
  const getTextAlign = (lhs: number, rhs: number, flip: boolean) => {
    if (lhs === 0 && rhs > 0) return flip ? "right" : "left";
    if (lhs > 0 && rhs === 0) return flip ? "left" : "right";
    return "center";
  };
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
          name={name}
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
          name={name}
          direct={direct}
          pos={posAdd(pos, [width / 2 - 17, (i - (arr.length - 1) / 2) * 40])}
          hov={hover}
          icon={icon}
        />
      ))}
    </g>
  );
};

const PrimView: FC<{
  left_ports: PackPort[];
  right_ports: PackPort[];
  name: string;
  pos: Position;
  flip: boolean;
  width: number;
  highlight: boolean;
  onClick: (_: any) => any;
  onMouseDown: (_: any) => any;
}> = ({ left_ports, right_ports, name, pos, flip, width, highlight, onClick, onMouseDown }) => {
  // Global State
  const color = useColor().editor.hw.graph.obj;

  // Local State
  const [hover, setHover] = useState(false);

  // Calculate
  const height = Math.max(left_ports.length, right_ports.length) * 40 - 6;
  const getTextAlign = (lhs: number, rhs: number, flip: boolean) => {
    if (lhs === 0 && rhs > 0) return flip ? "right" : "left";
    if (lhs > 0 && rhs === 0) return flip ? "left" : "right";
    return "center";
  };
  const text_align = getTextAlign(left_ports.length, right_ports.length, !flip);
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
        rx={5}
        fill={_color.fill}
      />
      {text_align === "center" && (
        <text x={ox} y={oy} fontSize={25} textAnchor="middle" alignmentBaseline="middle">
          {name}
        </text>
      )}
      {text_align === "right" && (
        <text x={ox + width / 2 - 40} y={oy} fontSize={25} textAnchor="end" alignmentBaseline="middle">
          {name}
        </text>
      )}
      {text_align === "left" && (
        <text x={ox - width / 2 + 40} y={oy} fontSize={25} textAnchor="start" alignmentBaseline="middle">
          {name}
        </text>
      )}
      {lp.map(({ name, direct, icon }, i, arr) => (
        <ObjPort
          key={name}
          side="left"
          name={""}
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
          name={""}
          direct={direct}
          pos={posAdd(pos, [width / 2 - 17, (i - (arr.length - 1) / 2) * 40])}
          hov={hover}
          icon={icon}
        />
      ))}
    </g>
  );
};

const ObjPort: FC<{ name: string; pos: Position; direct: "in" | "out"; side: "left" | "right"; hov: boolean; icon: PackPort["icon"] }> = ({
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
  const _icon = icon ?? ((direct === "in") === (side === "left") ? ">" : "<");
  const text_x = side === "left" ? cx + TEXT_OFFSET : cx - TEXT_OFFSET;
  const text_anchor = side === "left" ? "start" : "end";
  return (
    <>
      <circle cx={cx} cy={cy} r={14} fill={_color.port_bg} />
      {_icon === ">" && <RightIcon cx={cx} cy={cy} color={_color.port_icon} />}
      {_icon === "<" && <LeftIcon cx={cx} cy={cy} color={_color.port_icon} />}
      {_icon === "?" && <QuestionIcon cx={cx} cy={cy} color={_color.port_icon} />}
      {_icon === "!" && <ExclamationIcon cx={cx} cy={cy} color={_color.port_icon} />}
      {_icon === "#" && <HashIcon cx={cx} cy={cy} color={_color.port_icon} />}
      <text x={text_x} y={cy} fontSize={18} textAnchor={text_anchor} alignmentBaseline="middle">
        {name}
      </text>
    </>
  );
};
