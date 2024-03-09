import { dump, load } from "js-yaml";
import { useRecoilValue, useRecoilValueLoadable, useResetRecoilState, useSetRecoilState } from "recoil";
import { BOARD_DIR, BOARD_FILE, PROJ_FILE } from "~/consts";
import { Target, Project } from "~/files";
import { useMessage } from "../0_sys/message";
import { localPacksState } from "../1_library/1_packs";
import { useResetHweditorState } from "../4_view/editor";
import { targetPathState, targetState, projectNameState, projectPathState, projectState } from "./0_project";
import { revertBufferState } from "./2_revert";

export const useOpenProject = () => {
  useRecoilValueLoadable(localPacksState); // prefetch
  const { createMessage } = useMessage();

  const resetRevertBuffer = useResetRecoilState(revertBufferState);
  const resetSvg = useResetHweditorState();

  const setProjectPath = useSetRecoilState(projectPathState);
  const setProjectName = useSetRecoilState(projectNameState);
  const setProject = useSetRecoilState(projectState);
  const setBoardPath = useSetRecoilState(targetPathState);
  const setBoard = useSetRecoilState(targetState);

  return async (path: string[]) => {
    window.log.info("openProject: Start");
    try {
      resetRevertBuffer();
      resetSvg();
      const appHome = await window.ipc.dir.getHome();
      // ----------------------------------------------------------------------
      window.log.info("openProject: Load Project");
      const proj = await window.ipc.fs.read([...path, PROJ_FILE]).then((str) => load(str) as Project);
      console.log(proj);
      // ----------------------------------------------------------------------
      window.log.info("openProject: Load Board");
      const boardPath = [...appHome, BOARD_DIR, ...proj.target.path];
      const board = await window.ipc.fs.read([...boardPath, BOARD_FILE]).then((str) => load(str) as Target);
      // ----------------------------------------------------------------------
      setProjectPath(path);
      setProjectName(path.at(-1) as string);
      setProject(proj);
      setBoardPath(boardPath);
      setBoard(board);
      window.log.info("openProject: Done");
    } catch (e) {
      window.log.error("openProject: Failed");
      window.log.error(e);
      createMessage("error", "Failed to open project", `${e}`);
    }
  };
};

export const useSaveProject = () => {
  const projectPath = useRecoilValue(projectPathState);
  const project = useRecoilValue(projectState);
  return () => {
    const selected: Project = {
      target: project.target,
      objs: project.objs,
      wires: project.wires.map(({ first, last, waypoints, width }) => ({ first, last, waypoints, width })),
    };
    const str = dump(selected, { indent: 2, noRefs: true, flowLevel: 2 });
    window.ipc.fs
      .write([...projectPath, PROJ_FILE], str)
      .then(() => console.log(`Project Saved: ${projectPath.join("/")}`))
      .catch((e) => console.error(e));
  };
};
