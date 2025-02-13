// Gets the best match for a path, the longest matching prefix for file serving purposes
const findBestMatch = (arr: string[], str: string) =>
  arr
    .filter((path) => str.startsWith(path))
    .sort((a, b) => b.length - a.length)[0] || null;

export default findBestMatch;
