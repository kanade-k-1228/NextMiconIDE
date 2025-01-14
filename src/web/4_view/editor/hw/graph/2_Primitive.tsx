import { FC, useState } from "react";
import { Obj, Target } from "~/files";
import { Position, posAdd, posFlip, posSub } from "~/utils";
import { useColor } from "~/web/2_store";
import { usePrim } from "~/web/3_facade";
import { ExclamationIcon, LeftIcon, QuestionIcon, RightIcon } from "~/web/4_view/atom";

export const PrimitiveComponent: FC<{ obj: Obj }> = ({ obj }) => {
  // Global State
  const { selected, onClick, onMouseDown } = usePrim(obj);
  const color = useColor().editor.hw.graph.obj;

  // Local State
  const [hover, setHover] = useState(false);

  // Calculate
  const [width, height] = posSub(obj.pack.size, [0, 4]);
  const [ox, oy] = obj.pos;
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
        rx={18}
        fill={highlight ? color.hov.fill : color._.fill}
      />
      <text
        x={obj.flip ? ox - width / 2 + 40 : ox + width / 2 - 40}
        y={oy}
        fontSize={22}
        textAnchor={obj.flip ? "start" : "end"}
        alignmentBaseline="middle"
      >
        {obj.name}
      </text>
      {obj.pack.ports.map((port) => (
        <IOPortBg key={port.name} port={port} flip={obj.flip ?? false} hover={highlight} origin={obj.pos} />
      ))}
      {obj.pack.ports.map((port) => (
        <IOPortIcon key={port.name} port={port} flip={obj.flip ?? false} hover={highlight} origin={obj.pos} />
      ))}
    </g>
  );
};

export const IoifView: FC<{ ioif: Target["ioifs"][number]; ioName: string; pos: Position; flip: boolean }> = ({
  ioif,
  ioName,
  pos,
  flip,
}) => {
  // Global State
  const color = useColor().editor.hw.graph.obj;

  // Local State
  const [hover, setHover] = useState(false);

  // Calculate
  const [width, height] = posSub(ioif.size, [0, 4]);
  const [ox, oy] = pos;
  const highlight = true;

  return (
    <g onMouseOver={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ cursor: "pointer" }}>
      <rect
        x={ox - width / 2}
        y={oy - height / 2}
        width={width}
        height={height}
        stroke={highlight ? color.hov.border : color._.border}
        strokeWidth={2}
        rx={18}
        fill={highlight ? color.hov.fill : color._.fill}
      />
      <text
        x={flip ? ox - width / 2 + 40 : ox + width / 2 - 40}
        y={oy}
        fontSize={22}
        textAnchor={flip ? "start" : "end"}
        alignmentBaseline="middle"
      >
        {ioName}
      </text>
      {ioif.ports.map((port) => (
        <IOPortBg key={port.name} port={port} flip={flip} hover={highlight} origin={pos} />
      ))}
      {ioif.ports.map((port) => (
        <IOPortIcon key={port.name} port={port} flip={flip} hover={highlight} origin={pos} />
      ))}
    </g>
  );
};

const IOPortBg: FC<{
  port: Target["ioifs"][number]["ports"][number];
  origin: Position;
  hover: boolean;
  flip: boolean;
}> = ({ port, origin, hover, flip }) => {
  const side = port.pos[0] > 0 !== flip;
  const color = useColor().editor.hw.graph.obj;
  const [x, y] = posAdd(origin, flip ? posFlip(port.pos) : port.pos);
  const [cx, cy] = side ? [x - 18, y] : [x + 18, y];
  return <circle cx={cx} cy={cy} r={14} fill={hover ? color.hov.port_bg : color._.port_bg} />;
};

const IOPortIcon: FC<{
  port: Target["ioifs"][number]["ports"][number];
  origin: Position;
  hover: boolean;
  flip: boolean;
}> = ({ port, origin, hover, flip }) => {
  const side = port.pos[0] > 0 !== flip;
  const color = useColor().editor.hw.graph.obj;
  const [x, y] = posAdd(origin, flip ? posFlip(port.pos) : port.pos);
  const io = port.direct === "input";
  const [cx, cy] = side ? [x - 18, y] : [x + 18, y];
  const icon = port.icon;

  const _color = hover ? color.hov.port_icon : color._.port_icon;
  return (
    <>
      {icon === "!" && <ExclamationIcon cx={cx} cy={cy} color={_color} />}
      {icon === "?" && <QuestionIcon cx={cx} cy={cy} color={_color} />}
      {icon === undefined && (side === io ? <LeftIcon cx={cx} cy={cy} color={_color} /> : <RightIcon cx={cx} cy={cy} color={_color} />)}
    </>
  );
};
