export async function fetchData(url: string, init?: RequestInit): Promise<any> {
  try {
    const response = await fetch(url, init);
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch (error) {
    // Debug: Enable the next line
    // console.error(error);
    return null;
  }
}
