export type Wire = {
  first: [string, string];
  last: [string, string];
  width: number;
} & EdgeView;

type EdgeView = { waypoints: [number, number][] };
