import { getAnchorElements } from "../lib/getAnchorElements";

describe("getAnchorElements", () => {
  test("includes anchors from open shadow roots", () => {
    const shadowAnchor = {} as HTMLAnchorElement;
    const shadowRoot = {
      querySelectorAll: (selector: string) => {
        if (selector === "a") return [shadowAnchor];
        return [];
      },
    } as unknown as ShadowRoot;

    const host = {
      shadowRoot,
    } as Element;

    const lightDomAnchor = {} as HTMLAnchorElement;
    const root = {
      querySelectorAll: (selector: string) => {
        if (selector === "a") return [lightDomAnchor];
        if (selector === "*") return [host];
        return [];
      },
    } as unknown as ParentNode;

    expect(getAnchorElements(root)).toEqual([lightDomAnchor, shadowAnchor]);
  });
});
