(async () => {
  let totalEntitiesCount = 0;
  let moreRecords = true;
  let skipToken;
  while(moreRecords) {
    const result = await Xrm.WebApi.online.retrieveMultipleRecords(
      "contact",
      `?$select=contactid${ skipToken ? `&$skiptoken=${encodeURIComponent(skipToken)}` : "" }`);
    totalEntitiesCount += result.entities.length;
    if(result.nextLink) {
      const nextUrl = new URL(result.nextLink);
      skipToken = nextUrl.searchParams.get("$skiptoken");
      console.log(`${totalEntitiesCount}. getting more records...`);
    } else {
      moreRecords = false;
    }
  }
  console.log(totalEntitiesCount);
})();