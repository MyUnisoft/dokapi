// Import Internal Dependencies
import * as utils from "../src/utils";

describe("searchMarkdownHeadTitle", () => {
  it("should found the right title in the provided markdown string", () => {
    const result = utils.searchMarkdownHeadTitle("# hello world");

    expect(result).toStrictEqual("hello world");
  });

  it("should found the right title in the provided multi-line markdown string", () => {
    const result = utils.searchMarkdownHeadTitle(`
    foobar
    # hey
    ## yo yo
    `);

    expect(result).toStrictEqual("hey");
  });

  it("should return null because the provided string is empty", () => {
    const result = utils.searchMarkdownHeadTitle("");

    expect(result).toStrictEqual(null);
  });
});
