import { loadCSS, loadJS } from "markmap/packages/markmap-common";
import { Transformer } from "markmap/packages/markmap-lib";
import * as markmap from "markmap/packages/markmap-view";

export const transformer = new Transformer();
const { scripts, styles } = transformer.getAssets();
loadCSS(styles);
loadJS(scripts, { getMarkmap: () => markmap });
