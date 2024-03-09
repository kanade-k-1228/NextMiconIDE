export interface Target {
  templates: string[][];

  addr: {
    reserved: number;
    pageSize: number;
    maxAddr: number;
  };

  ioports: Record<string, "i" | "o" | "io">;
  irqs: string[];

  tools: { name: string; cmd: string; inst: string }[];
  cmd: { name: string; src: string[]; out: string[]; cmd: string; arg: string[] }[];
}
