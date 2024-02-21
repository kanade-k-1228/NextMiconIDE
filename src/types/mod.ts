export type Mod = {
  ports: Port[];
  params: Param[];
  sw?: {
    class: string;
    byte: number;
    methods: (Func & { note: string })[];
  };
};

export type Port = { name: string; direct: "in" | "out"; width: number; side: "left" | "right" };
export type Param = { name: string; type: string };
export type Func = { name: string; type: string; args: { name: string; type: string }[] };
