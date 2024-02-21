import { Allotment } from "allotment";
import { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { hweditorSizesState, paneState, useColor } from "~/web/2_store";
import { useHWEditorFacade } from "~/web/3_facade";
import { css } from "../../atom";
import { MiconEditor } from "./graph/MiconEditor";
import { InfoPane, ModPane, PrimPane } from "./pane";
import { EditorToolBar, PaneTabBar } from "./toolbar/ButtonBar";

export const HWEditor = () => {
  const { keyboard } = useHWEditorFacade();
  useEffect(() => {
    document.addEventListener("keydown", keyboard);
    return () => document.removeEventListener("keydown", keyboard);
  }, [keyboard]);

  const [sizes, setSizes] = useRecoilState(hweditorSizesState);
  const pane = useRecoilValue(paneState);
  const color = useColor();

  return (
    <div style={{ ...css.colGrid({ column: [50, null, 50] }), background: color.editor.hw.graph.canvas.bg }}>
      <PaneTabBar />
      <Allotment onChange={setSizes} defaultSizes={sizes}>
        <Allotment.Pane preferredSize={400} minSize={50}>
          <div style={{ overflow: "scroll" }}>
            {pane.type === "info" && <InfoPane />}
            {pane.type === "primitive" && <PrimPane />}
            {pane.type === "pack" && <ModPane />}
          </div>
        </Allotment.Pane>
        <Allotment.Pane minSize={50}>
          <MiconEditor />
        </Allotment.Pane>
      </Allotment>
      <EditorToolBar />
    </div>
  );
};
