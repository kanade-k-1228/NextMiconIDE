export interface Package {
  ports: (PackPort & PortSideExt)[];
  params: { name: string; type: string }[];
  software?: {
    className: string;
    memSize: number;
    methods: ({ note: string } & Func)[];
  };
}

export type PackPort = {
  name: string;
  type: string;
  bit: number;
  direct: "in" | "out";
  icon?: "?" | "!" | ">" | "<" | "#";
};

export type PortSideExt = { side: "left" | "right" };

export interface Func {
  type: string;
  name: string;
  args: { type: string; name: string }[];
}
