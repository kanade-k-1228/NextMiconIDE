export interface Project {
  target: {
    path: string[];
  };
  objs: Node[];
  wires: Wire[];
}
