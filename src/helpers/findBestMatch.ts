export default function findBestMatch(
  arr: string[],
  str: string
): string | null {
  return (
    arr
      .filter((path) => str.startsWith(path)) // Find all matching prefixes
      .sort((a, b) => b.length - a.length)[0] || null
  ); // Return the longest one
}
