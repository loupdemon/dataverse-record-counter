import getApiUrl from "./get-api-url";

export default async function getApiResult(path, searchParams) {
  const apiUrl = getApiUrl();

  apiUrl.pathname += path;
  for (const param in searchParams) {
    apiUrl.searchParams.set(param, searchParams[param]);
  }

  const response = await fetch(apiUrl.href);
  return await response.json();
}
