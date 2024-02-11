import test from "node:test";
import { CSSProperties, FC, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { boardState, hwEditorFSM, useAvailableIoports, useColor } from "~/web/2_store";
import { Accordion } from "~/web/4_view/atom";

export const IoportPane: FC<{ style?: CSSProperties }> = ({ style }) => {
  const color = useColor();
  const board = useRecoilValue(boardState);
  const getAvailableIOPorts = useAvailableIoports();
  return (
    <div
      style={{
        overflowY: "scroll",
        ...style,
      }}
    >
      {board.ioifs.map(({ type }) => (
        <Accordion key={type} title={type}>
          {getAvailableIOPorts(type).map((name) => (
            <Ioport key={name} type={type} name={name} />
          ))}
        </Accordion>
      ))}
    </div>
  );
};

const Ioport: FC<{ type: string; name: string }> = ({ type, name }) => {
  const color = useColor().editor.hw.pane.item;
  const [fsm, setState] = useRecoilState(hwEditorFSM);
  const selected = fsm.state === "AddIoport" && fsm.value.type === type && fsm.value.name === name;
  const [hover, setHover] = useState(false);

  const _color = selected ? color.sel : hover ? color.hov : color._;

  return (
    <div
      style={{
        height: "30px",
        background: _color.bg,
        color: _color.text,
        cursor: "pointer",
        display: "grid",
        gridTemplateColumns: "20px 1fr",
      }}
    >
      <div></div>
      <div
        style={{ height: "100%", display: "flex", alignItems: "center" }}
        onClick={() => {
          setState({ state: "AddIoport", value: { type, name } });
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {name}
      </div>
    </div>
  );
};