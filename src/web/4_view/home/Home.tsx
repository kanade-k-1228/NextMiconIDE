import { Apps, DeveloperBoard, NoteAddOutlined, OpenInBrowser, Settings } from "@mui/icons-material";
import { FC } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { dialogState, routeState } from "~/web/2_route";
import { IconButton, TextButton, layout } from "~/web/4_view/atom";
import { projectListState, useColor } from "../../2_store";

export const Home: FC = () => {
  const color = useColor();
  return (
    <div style={{ ...layout.center, height: "100%", background: color.home._.bg, color: color.home._.text }}>
      <div style={{ maxWidth: "500px", maxHeight: "600px", width: "100%", height: "100%" }}>
        <div style={{ ...layout.grid({ row: ["1fr", "1fr", "3fr"] }) }}>
          <div style={{ ...layout.center, fontWeight: "bold", fontSize: 40 }}>Next Micon IDE</div>
          <Buttons />
          <ProjectList />
        </div>
      </div>
    </div>
  );
};

const Buttons: FC = () => {
  const color = useColor();
  const setRoute = useSetRecoilState(routeState);
  const setDialog = useSetRecoilState(dialogState);
  const openProjectWithDialog = () => {
    window.ipc.fs
      .browse({ title: "Select project root directory", properties: ["openDirectory"] })
      .then((paths) => paths.at(0))
      .then((root) => (root ? setRoute({ page: "editor", project: root }) : undefined));
  };
  return (
    <div style={{ ...layout.flex({ direction: "horizontal", justify: "space-between", align: "center" }) }}>
      <IconButton color={color.home.btn} size={80} onClick={() => setDialog("createProject")}>
        <NoteAddOutlined />
      </IconButton>
      <IconButton color={color.home.btn} size={80} onClick={openProjectWithDialog}>
        <OpenInBrowser />
      </IconButton>
      <IconButton color={color.home.btn} size={80} onClick={() => setDialog("setting")}>
        <Settings />
      </IconButton>
      <IconButton color={color.home.btn} size={80} onClick={() => setDialog("package")}>
        <Apps />
      </IconButton>
      <IconButton color={color.home.btn} size={80} onClick={() => setDialog("board")}>
        <DeveloperBoard />
      </IconButton>
    </div>
  );
};

const ProjectList: FC = () => {
  const recent = useRecoilValue(projectListState);
  // TODO: Last Modified 順に並べなおす
  return (
    <div style={{ ...layout.flex({ direction: "vertical" }) }}>
      {recent.map(({ name, path }, i) => (
        <ProjectItem key={i} name={`${i + 1}. ${name}`} path={path} />
      ))}
    </div>
  );
};

const ProjectItem: FC<{ name: string; path: string[] }> = ({ name, path }) => {
  const setRoute = useSetRecoilState(routeState);
  const color = useColor();

  return (
    <TextButton
      color={color.home.btn}
      style={{
        height: "30px",
        textAlign: "left",
        margin: "5px 0",
        padding: "0 5px",
        overflow: "hidden",
        whiteSpace: "nowrap",
      }}
      onClick={() => setRoute({ page: "editor", project: path })}
    >
      {name}
    </TextButton>
  );
};
