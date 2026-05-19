function getShadowRoots(root: ParentNode): ShadowRoot[] {
  return (Array.from(root.querySelectorAll("*")) as Element[]).reduce(
    (shadowRoots, element) => {
      if (!element.shadowRoot) {
        return shadowRoots;
      }

      shadowRoots.push(
        element.shadowRoot,
        ...getShadowRoots(element.shadowRoot),
      );
      return shadowRoots;
    },
    [] as ShadowRoot[],
  );
}

export function getAnchorElements(root: ParentNode = document) {
  return [root, ...getShadowRoots(root)].reduce((anchors, currentRoot) => {
    anchors.push(
      ...(Array.from(currentRoot.querySelectorAll("a")) as HTMLAnchorElement[]),
    );
    return anchors;
  }, [] as HTMLAnchorElement[]);
}
