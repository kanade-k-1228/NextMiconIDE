import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import { Project } from "~/files";
import { posRotX } from "~/utils";
import { ObjKey, getObjKey, objKeyEq } from "~/web/1_type";
import { projectState } from "../2_project/0_project";
import { useRevert } from "../2_project/2_revert";
import { selectIsEmpty, selectedObjectsState } from "./0_select";

const flipObj = (project: Project, key: ObjKey, center?: number): Project => ({
  ...project,
  objs: project.objs.map((obj) => (objKeyEq(getObjKey(obj), key) ? { ...obj, flip: !obj.flip, pos: posRotX(obj.pos, center) } : obj)),
});

export const useFlip = () => {
  const { commit } = useRevert();
  const [project, setProject] = useRecoilState(projectState);
  const selectedObjects = useRecoilValue(selectedObjectsState);
  const resetSelect = useResetRecoilState(selectedObjectsState);
  return () => {
    if (!selectIsEmpty(selectedObjects)) {
      console.log("Flip", selectedObjects);

      //   // TODO: Calculate selected objects area
      //   const area = selectedObjects.reduce(
      //     (acc, cur) => {
      //       // const range = getRange(cur);
      //       return acc;
      //     },
      //     { min: [0, 0] as Position, max: [0, 0] as Position },
      //   );
      // const center = posRound(posMul(posSub(area.max, area.min), 1 / 2));

      let ret = project;
      ret = selectedObjects.objs.reduce((acc, key) => flipObj(acc, key), ret);
      setProject(ret);
      commit();
    }
  };
};
