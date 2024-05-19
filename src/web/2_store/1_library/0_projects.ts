import { dump } from "js-yaml";
import { selector, useRecoilValue } from "recoil";
import { BOARD_DIR, BUILD_DIR, GITIGNORE_FILE, MICON_DIR, MK_FILE, PROJ_DIR, PROJ_FILE, SW_DIR, SW_FILE, SW_INIT } from "~/consts";
import { Project } from "~/files";
import { pathState } from "../0_sys/directory";

export const projectListState = selector({
  key: "projectList",
  get: async ({ get }) => {
    const { home } = get(pathState);
    // TODO: 最後に開いた順にする
    // TODO: PROJ_DIR 以外の場所にあるプロジェクトも含める
    const projList = await window.ipc.fs.subdir([...home, PROJ_DIR]);
    return projList.map((name) => ({ name, path: [...home, PROJ_DIR, name] }));
  },
});

export const useCreateProject = () => {
  const { home } = useRecoilValue(pathState);
  return async (name: string, board: { owner: string; name: string; version: string }) => {
    const proj = [...home, PROJ_DIR, name];
    // Create Micon
    await window.ipc.fs.mkdir([...proj]);
    const init: Project = { target: { path: [board.owner, board.name, board.version] }, objs: [], wires: [] };
    await window.ipc.fs.write([...proj, PROJ_FILE], dump(init));
    // Create Software
    await window.ipc.fs.mkdir([...proj, SW_DIR]);
    await window.ipc.fs.write([...proj, SW_DIR, SW_FILE], SW_INIT);
    // Copy Makefile
    const mkfile = await window.ipc.fs.read([...home, BOARD_DIR, board.owner, board.name, board.version, MK_FILE]);
    await window.ipc.fs.write([...proj, MK_FILE], mkfile);
    // Create build dir
    await window.ipc.fs.mkdir([...proj, BUILD_DIR]);
    // Create gitignore
    const gitignore = [MICON_DIR, BUILD_DIR].join("\n");
    await window.ipc.fs.write([...proj, GITIGNORE_FILE], gitignore);
  };
};
