export type Wire = {
  node: "Wire";
  first: [string, string];
  last: [string, string];
  type: number;
} & EdgeView;

type EdgeView = { waypoints: [number, number][] };
