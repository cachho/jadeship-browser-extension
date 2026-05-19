import type { Platform } from "../../models";

export function addImageElement(
  // link: HTMLAnchorElement,
  _: HTMLAnchorElement,
  src: string,
  platform?: Platform,
) {
  const imageContainer = document.createElement("a");
  imageContainer.href = src;
  imageContainer.target = "_blank";
  imageContainer.rel = "noopener noreferrer";

  const imageElement = document.createElement("img");
  imageElement.src = platform === "taobao" ? `${src}_16x16.jpg` : src;
  imageElement.style.width = "16px";
  imageElement.style.height = "16px";
  imageElement.style.marginLeft = "0.3rem";
  imageElement.style.padding = "1px";
  imageElement.style.verticalAlign = "middle";

  imageContainer.appendChild(imageElement);
  return imageContainer;
}
