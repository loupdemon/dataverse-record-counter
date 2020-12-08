const alphabet = "abcdefghijklmnopqrstuvwxyz";

export default function createAbcFilter(letterCount) {
  const charArray = [];
  for (let i = 0; i < letterCount; i++) {
    charArray.push(alphabet.substr(i, 1));
  }
  const filter = charArray
    .map((c) => `startswith(firstname,'${c}')`)
    .join(" or ");
  return filter;
}
