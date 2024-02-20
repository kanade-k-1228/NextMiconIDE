import { FC, useState } from "react";
import { Inst, Irq, Mem, Obj, Port, Reg } from "~/types";
import { Position, posAdd, posFlip } from "~/utils";
import { Pack } from "~/web/1_type";
import { ObjResolveExt, useColor } from "~/web/2_store";
import { useInst } from "~/web/3_facade";
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
  const [x, y] = mem.pos;
  return (
    <g x={x} y={y}>
      <text>Mem:{mem.name}</text>
    </g>
  );
};

const IrqView: FC<{ irq: Irq<ObjResolveExt> }> = ({ irq }) => {
  const [x, y] = irq.pos;
  return (
    <g x={x} y={y}>
      <text>Mem:{irq.name}</text>
    </g>
  );
};

const PortView: FC<{ port: Port<ObjResolveExt> }> = ({ port }) => {
  const [x, y] = port.pos;
  return (
    <g x={x} y={y}>
      <text>Port:{port.name}</text>
    </g>
  );
};

const RegView: FC<{ reg: Reg<ObjResolveExt> }> = ({ reg }) => {
  const [x, y] = reg.pos;
  return (
    <g x={x} y={y}>
      <text>Reg:{reg.name}</text>
    </g>
  );
};

const InstView: FC<{ inst: Inst<ObjResolveExt> }> = ({ inst }) => {
  // Global State
  const { onClick, onMouseDown, key, selected } = useInst(inst);
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
  left_ports: string[];
  right_ports: string[];
  name: string;
  pos: Position;
  flip: boolean;
  port_name: boolean;
  width: number;
}> = ({ left_ports, right_ports, name, pos, port_name, width }) => {
  // Global State
  const color = useColor().editor.hw.graph.obj;

  // Local State
  // const [hover, setHover] = useState(false);

  // Calculate
  const height = Math.max(left_ports.length, right_ports.length) * 40;

  const text_style = getTextStyle(left_ports.length, right_ports.length);
  const [ox, oy] = pos;
  const highlight = true;

  return (
    <g style={{ cursor: "pointer" }}>
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
      {text_style === "center" && (
        <text x={ox} y={oy} textAnchor="middle" alignmentBaseline="middle">
          {name}
        </text>
      )}
      {text_style === "right" && (
        <text x={ox + width / 2} y={oy} textAnchor="end" alignmentBaseline="middle">
          {name}
        </text>
      )}
      {text_style === "left" && (
        <text x={ox - width / 2} y={oy} textAnchor="start" alignmentBaseline="middle">
          {name}
        </text>
      )}
      {left_ports.map((port) => (
        <></>
      ))}
      {right_ports.map((port) => (
        <></>
      ))}
    </g>
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

// export const PrimitiveComponent: FC<{ obj: Obj }> = ({ obj }) => {
//   // Global State
//   const { selected, onClick, onMouseDown } = usePrim(obj);
//   const color = useColor().editor.hw.graph.obj;

//   // Local State
//   const [hover, setHover] = useState(false);

//   // Calculate
//   const [width, height] = posSub(obj.pack.size, [0, 4]);
//   const [ox, oy] = obj.pos;
//   const highlight = selected ? selected : hover;

//   return (
//     <g
//       onMouseOver={() => setHover(true)}
//       onMouseLeave={() => setHover(false)}
//       style={{ cursor: "pointer" }}
//       onClick={onClick}
//       onMouseDown={onMouseDown}
//     >
//       <rect
//         x={ox - width / 2}
//         y={oy - height / 2}
//         width={width}
//         height={height}
//         stroke={highlight ? color.hov.border : color._.border}
//         strokeWidth={2}
//         rx={18}
//         fill={highlight ? color.hov.fill : color._.fill}
//       />
//       <text
//         x={obj.flip ? ox - width / 2 + 40 : ox + width / 2 - 40}
//         y={oy}
//         fontSize={22}
//         textAnchor={obj.flip ? "start" : "end"}
//         alignmentBaseline="middle"
//       >
//         {obj.name}
//       </text>
//       {obj.pack.ports.map((port) => (
//         <IOPortBg key={port.name} port={port} flip={obj.flip ?? false} hover={highlight} origin={obj.pos} />
//       ))}
//       {obj.pack.ports.map((port) => (
//         <IOPortIcon key={port.name} port={port} flip={obj.flip ?? false} hover={highlight} origin={obj.pos} />
//       ))}
//     </g>
//   );
// };

// export const IoifView: FC<{ ioif: Target["ioifs"][number]; ioName: string; pos: Position; flip: boolean }> = ({
//   ioif,
//   ioName,
//   pos,
//   flip,
// }) => {
//   // Global State
//   const color = useColor().editor.hw.graph.obj;

//   // Local State
//   const [hover, setHover] = useState(false);

//   // Calculate
//   const [width, height] = posSub(ioif.size, [0, 4]);
//   const [ox, oy] = pos;
//   const highlight = true;

//   return (
//     <g onMouseOver={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ cursor: "pointer" }}>
//       <rect
//         x={ox - width / 2}
//         y={oy - height / 2}
//         width={width}
//         height={height}
//         stroke={highlight ? color.hov.border : color._.border}
//         strokeWidth={2}
//         rx={18}
//         fill={highlight ? color.hov.fill : color._.fill}
//       />
//       <text
//         x={flip ? ox - width / 2 + 40 : ox + width / 2 - 40}
//         y={oy}
//         fontSize={22}
//         textAnchor={flip ? "start" : "end"}
//         alignmentBaseline="middle"
//       >
//         {ioName}
//       </text>
//       {ioif.ports.map((port) => (
//         <IOPortBg key={port.name} port={port} flip={flip} hover={highlight} origin={pos} />
//       ))}
//       {ioif.ports.map((port) => (
//         <IOPortIcon key={port.name} port={port} flip={flip} hover={highlight} origin={pos} />
//       ))}
//     </g>
//   );
// };

// const IOPortBg: FC<{
//   port: Target["ioifs"][number]["ports"][number];
//   origin: Position;
//   hover: boolean;
//   flip: boolean;
// }> = ({ port, origin, hover, flip }) => {
//   const side = port.pos[0] > 0 !== flip;
//   const color = useColor().editor.hw.graph.obj;
//   const [x, y] = posAdd(origin, flip ? posFlip(port.pos) : port.pos);
//   const [cx, cy] = side ? [x - 18, y] : [x + 18, y];
//   return <circle cx={cx} cy={cy} r={14} fill={hover ? color.hov.port_bg : color._.port_bg} />;
// };

// const IOPortIcon: FC<{
//   port: Target["ioifs"][number]["ports"][number];
//   origin: Position;
//   hover: boolean;
//   flip: boolean;
// }> = ({ port, origin, hover, flip }) => {
//   const side = port.pos[0] > 0 !== flip;
//   const color = useColor().editor.hw.graph.obj;
//   const [x, y] = posAdd(origin, flip ? posFlip(port.pos) : port.pos);
//   const io = port.direct === "input";
//   const [cx, cy] = side ? [x - 18, y] : [x + 18, y];
//   const icon = port.icon;

//   const _color = hover ? color.hov.port_icon : color._.port_icon;
//   return (
//     <>
//       {icon === "!" && <ExclamationIcon cx={cx} cy={cy} color={_color} />}
//       {icon === "?" && <QuestionIcon cx={cx} cy={cy} color={_color} />}
//       {icon === undefined && (side === io ? <LeftIcon cx={cx} cy={cy} color={_color} /> : <RightIcon cx={cx} cy={cy} color={_color} />)}
//     </>
//   );
// };
