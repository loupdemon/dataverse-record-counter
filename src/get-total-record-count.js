export default async function getTotalRecordCount(entityName, query) {
  let totalEntitiesCount = 0;
  let moreRecords = true;
  let skipToken;
  while (moreRecords) {
    const result = await Xrm.WebApi.online.retrieveMultipleRecords(
      entityName,
      `${query}${
        skipToken ? `&$skiptoken=${encodeURIComponent(skipToken)}` : ""
      }`
    );
    totalEntitiesCount += result.entities.length;
    if (result.nextLink) {
      const nextUrl = new URL(result.nextLink);
      skipToken = nextUrl.searchParams.get("$skiptoken");
    } else {
      moreRecords = false;
    }
  }
  return totalEntitiesCount;
}
