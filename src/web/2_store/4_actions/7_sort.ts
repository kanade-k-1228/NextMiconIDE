import { Project } from "~/files";
import { useRevert } from "../2_project/2_revert";
import { useRecoilState } from "recoil";
import { projectState } from "../2_project/0_project";

const sortProj = (proj: Project): Project => ({
  ...proj,
  objs: proj.objs.toSorted((a, b) => (`${a.obj}.${a.name}` > `${b.obj}.${b.name}` ? 1 : -1)),
});

export const useSort = () => {
  const { commit } = useRevert();
  const [project, setProject] = useRecoilState(projectState);
  return () => {
    console.log("Sort");
    setProject(sortProj(project));
    commit();
  };
};
