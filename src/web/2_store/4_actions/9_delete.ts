import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import { Project } from "~/files";
import { ObjKey, WaypointKey, WireKey, getObjKey, getWireKey, objKeyEq, wireKeyEq } from "~/web/1_type";
import { projectState } from "../2_project/0_project";
import { useRevert } from "../2_project/2_revert";
import { selectIsEmpty, selectedObjectsState } from "./0_select";

const deleteObj = (project: Project, key: ObjKey): Project => ({
  ...project,
  objs: project.objs.filter((obj) => !objKeyEq(getObjKey(obj), key)),
  wires: project.wires.filter((wire) => wire.first[0] !== key && wire.last[0] !== key),
});

const deleteWire = (project: Project, key: WireKey): Project => ({
  ...project,
  wires: project.wires.filter((wire) => !wireKeyEq(getWireKey(wire), key)),
});

const deleteWaypoint = (project: Project, key: WaypointKey): Project => ({
  ...project,
  wires: project.wires.map((wire) =>
    wireKeyEq(getWireKey(wire), key.wire)
      ? { ...wire, waypoints: [...wire.waypoints.slice(0, key.index), ...wire.waypoints.slice(key.index + 1)] }
      : wire,
  ),
});

export const useDelete = () => {
  const { commit } = useRevert();
  const [project, setProject] = useRecoilState(projectState);
  const selectedObjects = useRecoilValue(selectedObjectsState);
  const resetSelect = useResetRecoilState(selectedObjectsState);
  return () => {
    if (!selectIsEmpty(selectedObjects)) {
      console.log("Delete", selectedObjects);
      let ret = project;
      ret = selectedObjects.objs.reduce(deleteObj, ret);
      ret = selectedObjects.wires.reduce(deleteWire, ret);
      ret = [...selectedObjects.waypoints].sort((lhs, rhs) => rhs.index - lhs.index).reduce(deleteWaypoint, ret); // TODO: this is adhoc impl
      setProject(ret);
      resetSelect();
      commit();
    }
  };
};
