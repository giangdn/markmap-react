import {
  CSSItem,
  JSItem,
  loadCSS,
  loadJS,
} from "markmap/packages/markmap-common";
import { Transformer } from "markmap/packages/markmap-lib";
import * as markmap from "markmap/packages/markmap-view";
import { useEffect, useState } from "react";

const useTransformer = () => {
  const [transformer, setTransformer] = useState<Transformer | undefined>();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function init() {
      const t = new Transformer();

      const { scripts, styles } = t.getAssets();

      // manually add KaTeX js
      const katexJs: JSItem = {
        type: "script",
        data: {
          src: "https://cdn.jsdelivr.net/npm/katex@0.16.18/dist/katex.min.js",
        },
      };
      scripts?.push(katexJs);

      await loadCSS(styles as CSSItem[]);
      await loadJS(scripts as JSItem[], { getMarkmap: () => markmap });

      setTransformer(t);
      setLoading(false);
    }

    init();
  }, []);

  return { transformer, loading };
};

export default useTransformer;
