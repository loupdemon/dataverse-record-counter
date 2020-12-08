

(async () => {
  const someLetters = "abcdefghijklmnopqrstuvwxyz";
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