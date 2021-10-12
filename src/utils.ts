/**
 * @description Search for a title in a given Markdown string
 * @example
 * searchMarkdownHeadTitle("# hello world"); // hello world
 */
export function searchMarkdownHeadTitle(markdown: string): string | null {
  const result = /#(.*)/gm.exec(markdown);

  if (result !== null) {
    return result[1].trim();
  }

  return null;
}
