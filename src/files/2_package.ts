export interface Package {
  ports: (Port & PortSideExt)[];
  params: { name: string; type: string }[];
  software?: {
    className: string;
    memSize: number;
    methods: ({ note: string } & Func)[];
  };
}

export type Port = {
  name: string;
  type: string;
  width: number;
  direct: "in" | "out";
};

export type PortSideExt = { side: "left" | "right" };

export interface Func {
  type: string;
  name: string;
  args: { type: string; name: string }[];
}
