import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import { Project } from "~/files";
import { Position, posAdd, posEq } from "~/utils";
import { ObjKey, WaypointKey, getObjKey, getWireKey, objKeyEq, wireKeyEq } from "~/web/1_type";
import { projectState } from "../2_project/0_project";
import { useRevert } from "../2_project/2_revert";
import { selectIsEmpty, selectedObjectsState } from "./0_select";

const moveObj = (project: Project, key: ObjKey, delta: Position): Project => ({
  ...project,
  objs: project.objs.map((obj) => (objKeyEq(getObjKey(obj), key) ? { ...obj, pos: posAdd(obj.pos, delta) } : obj)),
});

const moveWaypoint = (project: Project, key: WaypointKey, delta: Position): Project => ({
  ...project,
  wires: project.wires.map((wire) =>
    wireKeyEq(getWireKey(wire), key.wire)
      ? { ...wire, waypoints: wire.waypoints.map((p, i) => (i === key.index ? posAdd(p, delta) : p)) }
      : wire,
  ),
});

export const useMove = () => {
  const { commit } = useRevert();
  const [project, setProject] = useRecoilState(projectState);
  const selectedObjects = useRecoilValue(selectedObjectsState);
  const resetSelect = useResetRecoilState(selectedObjectsState);
  return (delta: Position) => {
    if (!posEq(delta, [0, 0]) && !selectIsEmpty(selectedObjects)) {
      console.log("Move", selectedObjects, delta);
      let ret = project;
      ret = selectedObjects.objs.reduce((acc, key) => moveObj(acc, key, delta), ret);
      ret = selectedObjects.waypoints.reduce((acc, key) => moveWaypoint(acc, key, delta), ret);
      setProject(ret);
      resetSelect();
      commit();
    }
  };
};
