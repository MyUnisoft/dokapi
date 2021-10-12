// Import Node.js Dependencies
import path from "path";
import fs from "fs/promises";

// Import Third-party Dependencies
import MarkdownIt from "markdown-it";

// Import Internals
import * as DokapiConfig from "./configuration";
import * as utils from "./utils";

// VARS & CONSTANTS
const md = new MarkdownIt();

export type ParsedMenu = Pick<DokapiConfig.DokapiMenu, "title" | "collapsable"> & {
  /** HTML content (parsed from the menu markdown) */
  html: string;

  subMenu?: boolean;
};

export async function* walk(
  location: string,
  menuList: DokapiConfig.DokapiMenu[],
  subMenu = false
): AsyncIterableIterator<ParsedMenu> {
  for (const menu of menuList) {
    const menuPath = path.join(location, menu.path);
    const stat = await fs.stat(menuPath);

    const readmePath = stat.isDirectory() ? path.join(menuPath, "README.md") : menuPath;
    const readmeStr = await fs.readFile(readmePath, "utf-8");

    const title = menu.title ?? utils.searchMarkdownHeadTitle(readmeStr);
    if (typeof title === "undefined" || title === null) {
      throw new Error(`Unable to found a title for path: ${menuPath}`);
    }

    yield {
      title,
      collapsable: menu.collapsable ?? false,
      subMenu,
      html: md.render(readmeStr)
    };

    if (Array.isArray(menu.menu)) {
      yield* walk(stat.isDirectory() ? menuPath : path.dirname(menuPath), menu.menu, true);
    }
  }
}
