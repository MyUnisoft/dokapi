/* eslint-disable arrow-body-style */

// Import Node.js Dependencies
import path from "path";

// Import Internal Dependencies
import * as DokapiConfig from "../src/configuration";

// CONSTANTS
const kFixturesPath = path.join(__dirname, "fixtures");

describe("read", () => {
  it("should be able to READ a valid dokaconfig.config.toml", async() => {
    const result = await DokapiConfig.read(
      path.join(kFixturesPath, "valid")
    );

    expect(result).toMatchSnapshot("ValidDokapiConfig");
  });

  it("should throw an error for an invalid configuration", async() => {
    expect(async() => {
      return await DokapiConfig.read(path.join(kFixturesPath, "invalid"));
    }).rejects.toThrow("Unable to validate Dokapi configuration, Reason: must have required property 'menu'");
  });

  it("should throw an error if the provided location doesn't exist", async() => {
    expect(async() => {
      return await DokapiConfig.read(path.join(kFixturesPath, "edklblelle"));
    }).rejects.toThrow();
  });
});
