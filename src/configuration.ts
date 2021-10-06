// Import Node.js Dependencies
import path from "path";
import fs from "fs/promises";

// Import Third-party Dependencies
import Ajv, { JTDDataType } from "ajv/dist/jtd";

// CONSTANTS
const kSchemaValidator = new Ajv();

export const schema = {
  type: "object",
  properties: {
    title: {
      type: "string"
    },
    menu: {
      type: "array",
      items: {
        type: "object"
      }
    }
  },
  optionalProperties: {
    logo: {
      type: "string"
    }
  },
  required: ["title", "menu"],
  additionalProperties: false
} as const;

export type DokapiConfiguration = JTDDataType<typeof schema>;

export async function read(location: string): Promise<DokapiConfiguration> {
  const str = await fs.readFile(
    path.join(location, "dokapi.config.json"),
    "utf-8"
  );

  const manifest = JSON.parse(str);
  const validate = kSchemaValidator.compile<DokapiConfiguration>(schema);
  if (!validate(manifest)) {
    console.log(validate.errors);

    throw new Error("Unable to validate Dokapi configuration");
  }

  return manifest;
}
