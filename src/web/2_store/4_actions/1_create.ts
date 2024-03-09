import { useRecoilState, useRecoilValue } from "recoil";
import { Target, Project } from "~/files";
import { Position } from "~/utils";
import { ObjKey, Port, Wire, WireKey, getObjKey, getWireKey, objKeyEq, wireKeyEq } from "~/web/1_type";
import { targetState, projectState } from "../2_project/0_project";
import { useRevert } from "../2_project/2_revert";
import { portsState } from "../3_selector/2_port";
import { useSelectObject } from "./0_select";
import { Obj, ObjViewExt } from "~/types";

// --------------------------------------------------------------------------------
// Find Unused

const getUnusedInPin = (target: Target, proj: Project) => {
  return Object.entries(target.ioports)
    .filter(([_, type]) => type.includes("i"))
    .filter(([name, _]) => proj.objs.find((obj) => obj.obj === "Port" && obj.name === name) === undefined)
    .map(([name, _]) => name);
};

export const useUnusedInPin = () => {
  const proj = useRecoilValue(projectState);
  const target = useRecoilValue(targetState);
  return getUnusedInPin(target, proj);
};

const getUnusedOutPin = (target: Target, proj: Project) => {
  return Object.entries(target.ioports)
    .filter(([_, type]) => type.includes("o"))
    .filter(([name, _]) => proj.objs.find((obj) => obj.obj === "Port" && obj.name === name) === undefined)
    .map(([name, _]) => name);
};

export const useUnusedOutPin = () => {
  const proj = useRecoilValue(projectState);
  const target = useRecoilValue(targetState);
  return getUnusedOutPin(target, proj);
};

const getUnusedInOutPin = (target: Target, proj: Project) => {
  return Object.entries(target.ioports)
    .filter(([_, type]) => type.includes("i") && type.includes("o"))
    .filter(([name, _]) => proj.objs.find((obj) => obj.obj === "Port" && obj.name === name) === undefined)
    .map(([name, _]) => name);
};

export const useUnusedInOutPin = () => {
  const proj = useRecoilValue(projectState);
  const target = useRecoilValue(targetState);
  return getUnusedInOutPin(target, proj);
};

const getUnusedIrq = (target: Target, proj: Project) => {
  return target.irqs.filter((irq) => proj.objs.find((obj) => obj.obj === "Irq" && obj.name === irq) === undefined);
};

export const useUnusedIrq = () => {
  const proj = useRecoilValue(projectState);
  const target = useRecoilValue(targetState);
  return getUnusedIrq(target, proj);
};

// --------------------------------------------------------------------------------
// Create Object

export const objExists = (project: Project, key: ObjKey) => project.objs.find((obj) => objKeyEq(getObjKey(obj), key)) !== undefined;

// Create temporary name
export const getNewObjName = (project: Project, base: string) => {
  for (let i = 0; Number.isSafeInteger(i); ++i) {
    const name = `${base}${i}`;
    if (!objExists(project, name)) return name;
  }
  throw `ERROR: Too Many Instance: ${base}`;
};

export const useGetNewObjName = () => {
  const project = useRecoilValue(projectState);
  return (base: string) => getNewObjName(project, base);
};

export const createObj = (project: Project, newObj: Obj<ObjViewExt>): Project => {
  if (objExists(project, newObj.name)) throw `Object name duplicate: ${newObj.name}`;
  return { ...project, objs: [...project.objs, newObj] };
};

export const useCreateObj = () => {
  const { commit } = useRevert();
  const [project, setProject] = useRecoilState(projectState);
  const selectInstance = useSelectObject();
  return (newObj: Obj<ObjViewExt>) => {
    setProject(createObj(project, newObj));
    commit();
    selectInstance(newObj.name);
  };
};

// --------------------------------------------------------------------------------
// CreateWire

export const createWire = (project: Project, newWire: Project["wires"][number]): Project => {
  return { ...project, wires: [...project.wires, newWire] };
};

const validateNewWire = (project: Project, newWire: Wire, ports: Port[]) => {
  // Find Port
  const fromPort = ports.find((port) => port.key === `${newWire.first[0]}/${newWire.first[1]}`);
  const toPort = ports.find((port) => port.key === `${newWire.last[0]}/${newWire.last[1]}`);
  if (fromPort === undefined) throw `Undefined port: ${newWire.first}`;
  if (toPort === undefined) throw `Undefined port: ${newWire.last}`;

  // Check Type of Connection
  if (fromPort.direct !== "out") throw `Invalid wire direction`;
  if (toPort.direct !== "in") throw `Invalid wire directon`;
  if (fromPort.bit !== toPort.bit) throw `Invalid wire width`;

  // Remove multiple drived port
  const alreadyDrived = project.wires.find((wire) => wire.last[0] === newWire.last[0] && wire.last[1] === newWire.last[1]);
  if (alreadyDrived !== undefined) throw `Port already connected: ${newWire.last}`;

  // Add wire
  return true;
};

export const useCreateWire = () => {
  const { commit } = useRevert();
  const [project, setProject] = useRecoilState(projectState);
  const ports = useRecoilValue(portsState);
  return (newWire: Wire) => {
    try {
      validateNewWire(project, newWire, ports);
      console.log(`Create wire: ${newWire.first} -> ${newWire.last}`);
      setProject(createWire(project, newWire));
      commit();
    } catch (e) {
      console.error(e);
    }
  };
};

// --------------------------------------------------------------------------------
// Create Waypoint

const createWaypoint = (project: Project, wireKey: WireKey, idx: number, pos: Position): Project => {
  return {
    ...project,
    wires: project.wires.map((wire) => {
      if (wireKeyEq(getWireKey(wire), wireKey)) {
        return { ...wire, waypoints: [...wire.waypoints.slice(0, idx), pos, ...wire.waypoints.slice(idx)] };
      } else return wire;
    }),
  };
};

export const useCreateWaypoint = () => {
  // Global State
  const { commit } = useRevert();
  const [project, setProject] = useRecoilState(projectState);

  // Local State
  return (wireKey: WireKey, idx: number, pos: Position) => {
    setProject(createWaypoint(project, wireKey, idx, pos));
    commit();
  };
};
