// Import Node.js Dependencies
import path from "path";
import fs from "fs/promises";

// Import Third-party Dependencies
import Ajv from "ajv";
import TOML from "@iarna/toml";

// Import Internal Dependencies
import schema from "./schema/configuration.schema.json";

// CONSTANTS
const kSchemaValidator = new Ajv();

/** String primitive containing a relative path to a file */
export type DokapiFilePath = string;

export interface DokapiMenu {
  /** Title of the page (Will be extracted from markdown if not provided) */
  title?: string;

  /** System path to page or the directory containing the page */
  path: DokapiFilePath;

  /** HTTP Configuration (examples & schemas) */
  http?: {
    jsonSchema?: DokapiFilePath;
    jsonResponse: DokapiFilePath;
  };

  /** Code examples (nodejs, typescript etc) */
  code?: DokapiFilePath | Record<string, DokapiFilePath>;

  /** Is the menu collapsable (see stripe API for an example) */
  collapsable?: boolean;

  menu?: DokapiSubMenu[];
}

export type DokapiSubMenu = Omit<DokapiMenu, "menu" | "collapsable">;

export interface DokapiConfiguration {
  /** Title of the API */
  title: string;

  /** The logo to show under the title */
  logo?: string;

  /** The list of accessible menu (pages) on the left */
  menu: DokapiMenu[];
}

export type DokapiSubConfiguration = Pick<DokapiConfiguration, "title"> & {
  menu: DokapiSubMenu[]
};

export interface ReadOptions {
  /** Default: `toml` */
  format?: "toml" | "json";
}

/**
 * @description Read, parse and validate a Dokapi configuration.
 */
export async function read(location: string, options: ReadOptions = {}): Promise<DokapiConfiguration> {
  const { format = "toml" } = options;

  const str = await fs.readFile(
    path.join(location, `dokapi.config.${format}`), "utf-8"
  );
  const manifest = format === "toml" ? TOML.parse(str) : JSON.parse(str);

  const validate = kSchemaValidator.compile(schema);
  if (!validate(manifest)) {
    const { message } = validate.errors![0];

    throw new Error(`Unable to validate Dokapi configuration, Reason: ${message}`);
  }

  return manifest as unknown as DokapiConfiguration;
}
