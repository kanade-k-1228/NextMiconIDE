export const hex = (v: number, pad: number) => {
  return ("0".repeat(pad) + v.toString(16).toUpperCase()).substr(-pad);
};
