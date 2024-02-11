import { KeyboardArrowDown, KeyboardArrowRight } from "@mui/icons-material";
import { CSSProperties, FC, Fragment, useState } from "react";
import { useRecoilValue } from "recoil";
import { Func, Package } from "~/files";
import { Instance } from "~/web/1_type";
import { instancesResolvedState, useColor } from "~/web/2_store";
import { layout } from "~/web/4_view/atom";

export const InstanceList = () => {
  const instances = useRecoilValue(instancesResolvedState);
  const color = useColor();
  return (
    <div style={{ overflow: "scroll", background: color.editor.sw.list.bg }}>
      <div
        style={{
          height: "auto",
          display: "flex",
          flexDirection: "column",
          userSelect: "none",
        }}
      >
        {instances
          .filter(({ pack }) => pack.software)
          .toSorted((lhs, rhs) => (lhs.name > rhs.name ? 1 : -1))
          .map((instance) => (
            <InstanceDoc key={instance.name} instance={instance} />
          ))}
      </div>
    </div>
  );
};

const InstanceDoc: FC<{ instance: Instance }> = ({ instance }) => {
  const color = useColor();

  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);

  const SIZE = 30;
  const iconCss: CSSProperties = { height: `${SIZE}px`, width: `${SIZE}px` };

  return (
    <div style={{ height: "auto", overflow: "hidden" }}>
      <div
        style={{
          height: SIZE,
          cursor: "pointer",
          display: "grid",
          gridTemplateColumns: `${SIZE}px 1fr`,
          // background: hover ? color.primary.dark : COLORS.sw.bg,
        }}
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div style={{ ...layout.center }}>{open ? <KeyboardArrowDown style={iconCss} /> : <KeyboardArrowRight style={iconCss} />}</div>
        <div style={{ ...layout.left, fontSize: SIZE - 10 }}>{instance.name}</div>
      </div>
      {open && (
        <div style={{ display: "flex", flexDirection: "column", rowGap: 10 }}>
          {instance.pack.software?.methods.map((method, i) => <Func key={i} inst={instance.name} note={method.note} method={method} />)}
        </div>
      )}
    </div>
  );
};

const Func: FC<{ inst: string; note: string; method: Func }> = ({ inst, note, method }) => {
  const color = useColor();
  const [hover, setHover] = useState(false);

  const use = `${inst}.${method.name}();`;

  const startWithLowercase = (str: string) => str.charAt(0) === str.charAt(0).toLowerCase();
  const typeColor = (str: string) => (startWithLowercase(str) ? color.editor.sw.list.embtype : color.editor.sw.list.objtype);

  return (
    <div
      style={{
        height: "auto",
        // background: hover ? color.primary.dark : COLORS.sw.bg,
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => window.ipc.clipboard.copy(use)}
    >
      <div style={{ ...layout.left, height: 20, whiteSpace: "nowrap" }}>
        <pre> </pre>
        <pre style={{ color: color.editor.sw.list.comment }}>{note}</pre>
      </div>
      <div style={{ ...layout.left, height: 20, whiteSpace: "nowrap" }}>
        <pre> </pre>
        <pre style={{ color: typeColor(method.type) }}>{method.type}</pre>
        <pre> </pre>
        <pre style={{ color: color.editor.sw.list.funcname, fontWeight: "bold" }}>{method.name}</pre>
        <pre>(</pre>
        {method.args.map((arg, i, arr) => {
          const sep = i < arr.length - 1;
          return (
            <Fragment key={i}>
              <pre style={{ color: typeColor(arg.type) }}>{arg.type}</pre>
              <pre> </pre>
              <pre style={{ color: color.editor.sw.list.varname }}>{arg.name}</pre>
              {sep && <pre>, </pre>}
            </Fragment>
          );
        })}
        <pre>);</pre>
      </div>
    </div>
  );
};
