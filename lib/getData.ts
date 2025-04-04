export async function getData(endpoint: string) {
  try {
    const response = await fetch(`/api/${endpoint}`, {
      cache: "no-store",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}