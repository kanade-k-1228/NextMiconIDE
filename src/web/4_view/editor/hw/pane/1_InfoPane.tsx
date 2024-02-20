import { Apps, ArrowRightAlt, Check, DeveloperBoard, KeyboardArrowDown, KeyboardArrowLeft, Timeline } from "@mui/icons-material";
import { FC, useState } from "react";
import { useRecoilValue } from "recoil";
import { Obj } from "~/types";
import { Wire, getWireKeyStr } from "~/web/1_type";
import { ObjResolveExt, boardState, objResolvedState, projectState, useColor, wiresResolvedState } from "~/web/2_store";
import { useObj, useWire } from "~/web/3_facade";
import { Center, IconButton, IconText, Left, css } from "~/web/4_view/atom";

export const InfoPane: FC = () => {
  const color = useColor().editor.hw.pane;
  return (
    <div style={{ background: color._.bg, color: color._.text }}>
      <IconText color={color.headder._} Icon={DeveloperBoard} height={40} text={"Target"} />
      <BoardInfo />
      <IconText color={color.headder._} Icon={Apps} height={40} text={"Objects"} />
      <ObjList />
      <IconText color={color.headder._} Icon={Timeline} height={40} text={"Wire"} />
      <WireList />
    </div>
  );
};

const BoardInfo: FC = () => {
  // Global State
  const color = useColor().editor.hw.pane;
  const proj = useRecoilValue(projectState);
  const board = useRecoilValue(boardState);

  // Local State
  const [detail, setDetail] = useState(false);

  return (
    <div style={{ ...css.colGrid({ column: [20, null, null, 30], row: 30 }), height: 30 }}>
      <div></div>
      <Left>{proj.target.path.join("/")}</Left>
      <div></div>
      <div></div>
    </div>
  );
};

const ObjList: FC = () => {
  const instances = useRecoilValue(objResolvedState);
  return (
    <div style={{ ...css.colGrid({ column: [20, null, null, 30], row: 30 }), height: "auto" }}>
      {instances.map((inst) => (
        <ObjListItem key={inst.name} obj={inst} />
      ))}
    </div>
  );
};

const ObjListItem: FC<{ obj: Obj<ObjResolveExt> }> = ({ obj }) => {
  // Global State
  const { selected, select, append, rename } = useObj(obj);
  const color = useColor().editor.hw.pane.item;

  // Local State
  const [detail, setDetail] = useState(false);
  const [hover, setHover] = useState(false);
  const [newName, setNewName] = useState(obj.name);

  // Calculate
  const _color = selected ? color.sel : hover ? color.hov : color._;
  const submitRename = () => {
    if (newName !== obj.name) rename(newName);
  };

  return (
    <>
      <div
        style={{ ...css.colSubGrid, cursor: "pointer", background: _color.bg, color: _color.text }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={(e) => (e.ctrlKey ? append() : select())}
      >
        <div></div>
        <Left>{obj.obj}</Left>
        <Left>{obj.name}</Left>
        <IconButton color={color.btn} style={{ margin: "2px" }} onClick={() => setDetail(!detail)}>
          {detail ? <KeyboardArrowDown /> : <KeyboardArrowLeft />}
        </IconButton>
      </div>
      {detail && (
        <div style={{ ...css.colSubGrid, cursor: "pointer", background: _color.bg, color: _color.text }}>
          <div></div>
          <div></div>
          <input
            onChange={(e) => setNewName(e.target.value)}
            value={newName}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                submitRename();
              }
            }}
          />
          <IconButton color={color.btn} style={{ margin: "2px" }} onClick={submitRename}>
            <Check />
          </IconButton>
        </div>
      )}
    </>
  );
};

const WireList: FC = () => {
  const wires = useRecoilValue(wiresResolvedState);
  return (
    <div style={{ ...css.colGrid({ column: [20, null, 20, 40, null], row: 30 }), height: "auto" }}>
      {wires.map((wire) => (
        <WireListItem key={getWireKeyStr(wire)} wire={wire} />
      ))}
    </div>
  );
};

const WireListItem: FC<{ wire: Wire }> = ({ wire }) => {
  // Global State
  const color = useColor().editor.hw.pane.item;
  const { selected, append, select } = useWire(wire);

  // Local State
  const [hover, setHover] = useState(false);

  // Calculate
  const _color = selected ? color.sel : hover ? color.hov : color._;

  return (
    <div
      style={{ ...css.colSubGrid, cursor: "pointer", background: _color.bg, color: _color.text, whiteSpace: "nowrap" }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={(e) => (e.ctrlKey ? append() : select())}
    >
      <div></div>
      <Left>{wire.first.join(".")}</Left>
      <Center>{wire.width}</Center>
      <Left>
        <ArrowRightAlt />
      </Left>
      <Left>{wire.last.join(".")}</Left>
    </div>
  );
};
