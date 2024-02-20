import { FC } from "react";
import { useRecoilValue } from "recoil";

import { Position, posRound } from "~/utils";
import { hwEditorFSM, mousePositionState, objResolvedState, portsState, useColor, wiresResolvedState } from "~/web/2_store";
import { Canvas } from "./0_Canvas";
import { ObjView } from "./1_Obj";
import { PortComponent } from "./2_Port";
import { WireComponent } from "./3_Wire";

export const MiconEditor: FC<{}> = () => {
  const objs = useRecoilValue(objResolvedState);
  const ports = useRecoilValue(portsState);
  const wires = useRecoilValue(wiresResolvedState);
  const fsm = useRecoilValue(hwEditorFSM);
  return (
    <Canvas>
      {fsm.state === "Selecting" && <SelectRect start={fsm.value.start} />}
      {objs?.map((obj) => <ObjView key={obj.name} node={obj} />)}
      {fsm.state === "AddWire" && <ConnectingWire path={[fsm.value.startPos, ...fsm.value.path]} />}
      {wires?.map((wire, i) => <WireComponent key={i} wire={wire} />)}
      {ports?.map((port) => <PortComponent key={port.key} port={port} />)}
      {/* {fsm.state === "AddNode" && <DummyNode pack={fsm.value.mod} name={fsm.value.name} />} */}
    </Canvas>
  );
};

const SelectRect: FC<{ start: Position; end?: Position }> = ({ start, end }) => {
  const mouse = useRecoilValue(mousePositionState);
  const [x1, y1] = start;
  const [x2, y2] = end ?? mouse;
  const [x, y] = [Math.min(x1, x2), Math.min(y1, y2)];
  const [width, height] = [Math.abs(x1 - x2), Math.abs(y1 - y2)];
  const color = useColor();
  return (
    <>
      <rect x={x} y={y} width={width} height={height} fill={color.editor.hw.graph.select.fill} opacity={0.3} />
      <rect x={x} y={y} width={width} height={height} fill="none" stroke={color.editor.hw.graph.select.stroke} strokeWidth={1} />
    </>
  );
};

const ConnectingWire: FC<{ path: Position[] }> = ({ path }) => {
  const mouse = useRecoilValue(mousePositionState);
  const color = useColor();
  const stickeyMouse = posRound(mouse);
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <polyline
        points={[...path, stickeyMouse].map(([x, y]) => `${x},${y}`).reduce((p, c) => `${p} ${c}`, "")}
        stroke={color.editor.hw.graph.wire._}
        strokeWidth={3}
      />
    </g>
  );
};
