async function getTotalRecordCount(entityName, query) {
  let totalEntitiesCount = 0;
  let moreRecords = true;
  let skipToken;
  while(moreRecords) {
    const result = await Xrm.WebApi.online.retrieveMultipleRecords(
      entityName,
      `${query}${ skipToken ? `&$skiptoken=${encodeURIComponent(skipToken)}` : "" }`);
    totalEntitiesCount += result.entities.length;
    if(result.nextLink) {
      const nextUrl = new URL(result.nextLink);
      skipToken = nextUrl.searchParams.get("$skiptoken");
    } else {
      moreRecords = false;
    }
  }
  return totalEntitiesCount;
}

(async () => {
  const someLetters = "abcdefghijklmnop";
  const charArray = [];
  for(let i = 0; i < someLetters.length; i++) {
    charArray.push(someLetters.substr(i, 1));
  }
  const filter = charArray
    .map(c => `startswith(firstname,'${c}')`)
    .join(" or ");
  const count = await getTotalRecordCount(
    "contact",
    `?$select=contactid&$filter=${filter}`
  );
  console.log(count);
})();

/*
    "<fetch>" +
      "<entity name='contact'>" +
        "<attribute name='contactid' />" +
      "</entity>" +
    "</fetch>"
*/