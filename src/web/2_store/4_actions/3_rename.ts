import { useRecoilState } from "recoil";
import { Project } from "~/files";
import { projectState } from "../2_project/0_project";
import { useRevert } from "../2_project/2_revert";

const renameObj = (project: Project, oldName: string, newName: string): Project => {
  const duplicate = project.objs.find((obj) => obj.name === newName);
  if (duplicate) {
    console.error(`Instance name duplicate: ${newName}`);
    return project;
  }
  return {
    ...project,
    // Rename instance
    objs: project.objs.map((obj) => (obj.name === oldName ? { ...obj, name: newName } : obj)),
    // Rename wire
    wires: project.wires.map((wire) => ({
      ...wire,
      first: wire.first[0] === oldName ? [newName, wire.first[1]] : wire.first,
      last: wire.last[0] === oldName ? [newName, wire.last[1]] : wire.last,
    })),
  };
};

export const useRenameInstance = () => {
  const [project, setProject] = useRecoilState(projectState);
  const { commit } = useRevert();
  return (oldName: string, newName: string) => {
    console.log("Rename", oldName, newName);
    setProject(renameObj(project, oldName, newName));
    commit();
  };
};
