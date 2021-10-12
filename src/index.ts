// Import Node.js Dependencies
import path from "path";
import fs from "fs/promises";

// Import Internals
import * as DokapiConfig from "./configuration";
import * as DokapiMenu from "./menu";

export interface generateDocumentationOptions {
  /** Default: `docs` */
  outDir?: string;
}

export async function generateDocumentation(location: string, options: generateDocumentationOptions = {}) {
  const { outDir = "docs" } = options;

  await fs.mkdir(path.join(location, outDir), { recursive: true });

  const config = await DokapiConfig.read(location);
  for await (const any of DokapiMenu.walk(location, config.menu)) {
    // console.log(any);
  }
}
