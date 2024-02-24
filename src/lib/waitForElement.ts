export function waitForElement(
  selector: string,
  callback: (element: Element) => void
): void {
  const interval: number = 100; // Interval in milliseconds
  const maxAttempts: number = 50; // Maximum number of attempts
  let attempts: number = 0;

  const intervalId: number = window.setInterval(() => {
    const element: Element | null = document.querySelector(selector);
    if (element) {
      clearInterval(intervalId);
      callback(element);
      // eslint-disable-next-line no-plusplus
    } else if (++attempts >= maxAttempts) {
      clearInterval(intervalId);
      console.error('Element not found within max attempts:', selector);
    }
  }, interval);
}
