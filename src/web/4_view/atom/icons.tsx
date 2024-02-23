import { FC } from "react";

const PathIcon: FC<{ path: string; color: string }> = ({ path, color }) => {
  return <path d={path} fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />;
};

// 左右で若干見え方が違うので、「＜＞」記号のデザインを微妙に変えている

export const LeftIcon: FC<{ cx: number; cy: number; color: string }> = ({ cx, cy, color }) => {
  return <PathIcon path={`M${cx + 4},${cy - 8} L${cx - 6},${cy} L${cx + 4},${cy + 8}`} color={color} />;
};

export const RightIcon: FC<{ cx: number; cy: number; color: string }> = ({ cx, cy, color }) => {
  return <PathIcon path={`M${cx - 4},${cy - 8} L${cx + 6},${cy} L${cx - 4},${cy + 8}`} color={color} />;
};

export const QuestionIcon: FC<{ cx: number; cy: number; color: string }> = ({ cx, cy, color }) => {
  const r = 4;
  return (
    <>
      <PathIcon path={`M${cx - r},${cy - r} A${r},${r} 0 1,1 ${cx},${cy} L${cx},${cy + 2}`} color={color} />
      <circle cx={cx} cy={cy + 7} r={2} fill={color} />
    </>
  );
};

export const ExclamationIcon: FC<{ cx: number; cy: number; color: string }> = ({ cx, cy, color }) => (
  <>
    <line x1={cx} y1={cy - 10} x2={cx} y2={cy + 3} stroke={color} strokeWidth={4} />
    <circle cx={cx} cy={cy + 8} r={2} fill={color} />
  </>
);

export const HashIcon: FC<{ cx: number; cy: number; color: string }> = ({ cx, cy, color }) => {
  return (
    <g strokeWidth={3} stroke={color} strokeLinecap="round">
      <line x1={cx - 2} y1={cy - 8} x2={cx - 4} y2={cy + 8} />
      <line x1={cx + 4} y1={cy - 8} x2={cx + 2} y2={cy + 8} />
      <line x1={cx - 6} y1={cy - 4} x2={cx + 7} y2={cy - 4} />
      <line x1={cx - 7} y1={cy + 4} x2={cx + 6} y2={cy + 4} />
    </g>
  );
};
