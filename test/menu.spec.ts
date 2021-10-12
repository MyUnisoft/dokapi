/* eslint-disable arrow-body-style */

// Import Node.js Dependencies
import path from "path";

// Import Internal Dependencies
import * as DokapiConfig from "../src/configuration";
import * as DokapiMenu from "../src/menu";

// CONSTANTS
const kFixturesPath = path.join(__dirname, "fixtures");

describe("walk", () => {
  it("should be able to walk and parse Markdown files for the 'valid' fixture", async() => {
    const fixturePath = path.join(kFixturesPath, "valid");

    const { menu } = await DokapiConfig.read(fixturePath);
    const result: DokapiMenu.ParsedMenu[] = [];

    for await (const row of DokapiMenu.walk(fixturePath, menu)) {
      result.push(row);
    }

    const [first, second] = result;
    expect(first.title).toStrictEqual("Hello world");
    expect(first.collapsable).toBeFalsy();
    expect(first.subMenu).toBeFalsy();
    expect(first.html).toMatchSnapshot();

    expect(second.title).toStrictEqual("All products");
    expect(second.collapsable).toBeTruthy();
    expect(second.subMenu).toBeFalsy();
    expect(second.html).toMatchSnapshot();
  });

  it("should be able to walk sub menu", async() => {
    const fixturePath = path.join(kFixturesPath, "submenu");

    const menu: DokapiConfig.DokapiMenu[] = [
      {
        path: "main.md",
        menu: [
          { path: "subpage.md" }
        ]
      }
    ];
    const result: DokapiMenu.ParsedMenu[] = [];

    for await (const row of DokapiMenu.walk(fixturePath, menu)) {
      result.push(row);
    }

    const [first, second] = result;
    expect(first.title).toStrictEqual("Main page");
    expect(first.subMenu).toBeFalsy();

    expect(second.title).toStrictEqual("Sub page");
    expect(second.subMenu).toBeTruthy();
  });

  it("should throw if title is missing", async() => {
    expect.assertions(2);
    const fixturePath = path.join(kFixturesPath, "missingTitle");

    const menu: DokapiConfig.DokapiMenu[] = [
      { path: "empty.md" }
    ];

    try {
      const result: DokapiMenu.ParsedMenu[] = [];
      for await (const row of DokapiMenu.walk(fixturePath, menu)) {
        result.push(row);
      }
    }
    catch (error) {
      expect(error.name).toStrictEqual("Error");
      expect(error.message.includes("Unable to found a title for path")).toStrictEqual(true);
    }
  });
});
