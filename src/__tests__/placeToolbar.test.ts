import { describe, expect, it } from "bun:test";
import { placeToolbar } from "../lib/placeToolbar";

class MockElement {
  public firstElementChild: MockElement | null = null;

  insertAdjacentElement(position: string, element: MockElement) {
    if (position === "afterbegin") {
      this.firstElementChild = element;
    }

    return element;
  }
}

describe("placeToolbar", () => {
  it("mounts the toolbar at a uniform body position for agent-specific pages", () => {
    const body = new MockElement() as unknown as HTMLBodyElement;
    const toolbarRoot = new MockElement() as unknown as HTMLElement;

    placeToolbar(body, toolbarRoot);

    expect(body.firstElementChild).toBe(toolbarRoot);
  });
});
