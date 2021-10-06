// Import Node.js Dependencies
// import path from "path";
// import fs from "fs/promises";

// Import Internals
import * as DokapiConfig from "./configuration";

export interface generateDocumentationOptions {
  /** Default: `docs` */
  outDir?: string;
}

export async function generateDocumentation(location: string, options: generateDocumentationOptions = {}) {
  const { outDir = "docs" } = options;
  console.log(outDir);

  const config = await DokapiConfig.read(location);
  console.log(config);
}
