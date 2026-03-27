import React, { useRef, useEffect } from "react";
import { Markmap } from "markmap/packages/markmap-view";
import useTransformer from "./markmap";
import { Toolbar } from "markmap/packages/markmap-toolbar";
import "markmap/packages/markmap-toolbar/dist/style.css";
import { INode } from "markmap/packages/markmap-common/dist/types/common";

const initValue = ` # Giải phương trình bậc 2
- Bước 1: Tính $\\Delta = b^2 - 4ac$.
- Bước 2:
  - Nếu $\\Delta > 0$: có hai nghiệm ==phân biệt==  $\\sqrt{\\Delta}{2a}.$
  - Nếu $\\Delta = 0$: \`có nghiệm kép\`
    $x = -\\frac{b}{2a}.$
  - [x] Nếu $\\Delta < 0$: phương trình vô nghiệm trong tập số thực.`;

function renderToolbar(mm: Markmap, wrapper: HTMLElement) {
  while (wrapper?.firstChild) wrapper.firstChild.remove();
  if (mm && wrapper) {
    const toolbar = new Toolbar();
    toolbar.attach(mm);
    // Register custom buttons
    toolbar.register({
      id: "alert",
      title: "Click to show an alert",
      content: "Alert",
      onClick: () => alert("You made it!"),
    });
    toolbar.showBrand = false;
    toolbar.setItems(["zoomIn", "zoomOut", "fit"]);
    wrapper.append(toolbar.render());
  }
}

export default function MarkmapHooks() {
  // const [value, setValue] = useState(initValue);
  // Ref for SVG element
  const refSvg = useRef<SVGSVGElement | null>(null);
  // Ref for markmap object
  const refMm = useRef<Markmap | null>(null);
  // Ref for toolbar wrapper
  const refToolbar = useRef<HTMLDivElement | null>(null);

  const { transformer, loading } = useTransformer();

  // 1. Define your color list as colors from all default tailwindcss colors hex
  const hex500Array = [
    "#14b89a",
    "#ec489a",
    "#6366f1",
    "#84cc16",
    "#f97316",
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#a855f7",
    "#22c55e",
    "#d946ef",
    "#0ea5e9",
    "#f43f5e",
    "#8b5cf6",
    "#eab308",
    "#64748b",
    "#06b6d4",
  ];
  const colorMap = new Map<string, string>();
  let colorIndex = 0;

  // 2. Create a color function
  function color(item: INode) {
    const key = item.state?.key ?? item.content ?? JSON.stringify(item);
    if (!colorMap.has(key)) {
      colorMap.set(key, hex500Array[colorIndex % hex500Array.length]);
      colorIndex += 1;
    }
    return colorMap.get(key)!;
  }

  useEffect(() => {
    // Create markmap and save to refMm
    if (refMm.current) return;
    const mm = Markmap.create(refSvg.current as SVGSVGElement);
    refMm.current = mm;
    colorIndex = 0;

    mm.setOptions({
      color,
      spacingHorizontal: 120,
      spacingVertical: 20,
      fitRatio: 0.95,
      autoFit: true,
      duration: 300,
      maxWidth: 320,
    });

    renderToolbar(refMm.current, refToolbar.current as HTMLElement);
  }, [refSvg.current]);

  useEffect(() => {
    // Update data for markmap once value is changed
    const mm = refMm.current;
    if (!mm || !transformer || loading) return;

    const { root } = transformer.transform(initValue);

    mm.setData(root).then(() => mm.fit());
  }, [transformer]);

  return (
    <React.Fragment>
      <div>
        <textarea
          className="w-full h-full border border-gray-400"
          value={initValue}
        />
      </div>
      <div className="flex-1">
        <svg className="markmap w-full h-full" ref={refSvg} />
      </div>
      <div className="absolute bottom-1 right-1" ref={refToolbar}></div>
    </React.Fragment>
  );
}
