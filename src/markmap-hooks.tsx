import React, { useState, useRef, useEffect } from "react";
import { Markmap } from "markmap/packages/markmap-view";
import { transformer } from "./markmap";
import { Toolbar } from "markmap/packages/markmap-toolbar";
import "markmap/packages/markmap-toolbar/dist/style.css";
import { INode } from "markmap/packages/markmap-common/dist/types/common";

const initValue = `# Lê Trang Tông (trị vì 1533 - 1548)
  - Con: Lê Trung Tông (trị vì 1548)
  - Con: Lê Anh Tông (trị vì 1556 - 1573)
    - Con: Lê Thế Tông (trị vì 1573 - 1599; khi nhỏ là hoàng tử Lê Duy Đàm)
      - Con: Lê Kính Tông (trị vì 1600 - 1619; hoàng tử Lê Duy Kỳ)
        - Con: Lê Thần Tông (trị vì 1619 - 1643, 1649 - 1662; hai lần lên ngôi)
          - Con: Lê Chân Tông (trị vì 1643 - 1649)
          - Con: Lê Huyền Tông (trị vì 1662 - 1671)
            - Em họ/chi thứ kế vị: Lê Gia Tông (trị vì 1672 - 1675)
              - Kế vị trong tông thất: Lê Hy Tông (trị vì 1675 - 1705)
                - Con: Lê Dụ Tông (trị vì 1705 - 1729)
                  - Con: Lê Duy Phường (trị vì 1729 - 1732)
                  - Con: Lê Thuần Tông (trị vì 1732 - 1735)
                  - Con: Lê Ý Tông (trị vì 1735 - 1740)
                  - Con: Lê Hiển Tông (trị vì 1740 - 1786)
                    - Con: Lê Chiêu Thống (trị vì 1786 - 1789; trước là hoàng tử Lê Duy Kỳ)
                    - Em: Lê Duy Cận (hoàng tử, từng làm Giám quốc 1787 - 1788)`;

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
  const [value, setValue] = useState(initValue);
  // Ref for SVG element
  const refSvg = useRef<SVGSVGElement | null>(null);
  // Ref for markmap object
  const refMm = useRef<Markmap | null>(null);
  // Ref for toolbar wrapper
  const refToolbar = useRef<HTMLDivElement | null>(null);

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
      // initialExpandLevel: 5,
      spacingHorizontal: 60,
      spacingVertical: 20,
      fitRatio: 0.95,
      autoFit: true,
      duration: 300,
    });

    renderToolbar(refMm.current, refToolbar.current as HTMLElement);
  }, [refSvg.current]);

  useEffect(() => {
    // Update data for markmap once value is changed
    const mm = refMm.current;
    if (!mm) return;
    const { root } = transformer.transform(value);
    mm.setData(root).then(() => mm.fit());
  }, [refMm.current, value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setValue(e.target.value);

  return (
    <React.Fragment>
      <div>
        <textarea
          className="w-full h-full border border-gray-400"
          value={value}
          onChange={handleChange}
        />
      </div>
      <div className="flex-1">
        <svg className="markmap w-full h-full" ref={refSvg} />
      </div>
      <div className="absolute bottom-1 right-1" ref={refToolbar}></div>
    </React.Fragment>
  );
}
