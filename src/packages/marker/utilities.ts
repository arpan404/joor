/**
 * Replaces all occurrences of a substring within a string with a replacer string
 * @param string - The original string to perform replacements on
 * @param substring - The substring to search for
 * @param replacer - The string to replace the substring with
 * @returns The modified string with all replacements
 */
export function stringReplaceAll(
  string: string,
  substring: string,
  replacer: string
): string {
  // Input validation
  if (!string || !substring) {
    return string;
  }

  let index = string.indexOf(substring);

  if (index === -1) {
    return string;
  }

  const substringLength = substring.length;

  let endIndex = 0;

  let returnValue = '';

  // Iterate through all occurrences of substring
  do {
    // Build the new string piece by piece:
    // 1. Add the part before the match
    // 2. Add the substring
    // 3. Add the replacer
    returnValue += string.slice(endIndex, index) + replacer;
    endIndex = index + substringLength;
    index = string.indexOf(substring, endIndex);
  } while (index !== -1);
  // Add the remaining part of the string
  returnValue += string.slice(endIndex);
  return returnValue;
}

/**
 * Encases CRLF (Carriage Return Line Feed) or LF (Line Feed) with prefix and postfix strings
 * starting from a specific index
 * @param string - The original string to process
 * @param prefix - The string to add before each line break
 * @param postfix - The string to add after each line break
 * @param index - The starting index to begin processing
 * @returns The modified string with encased line breaks
 */
export function stringEncaseCRLFWithFirstIndex(
  string: string,
  prefix: string,
  postfix: string,
  index: number
): string {
  // Input validation
  if (!string || index < 0 || index >= string.length) {
    return string;
  }

  let endIndex = 0;

  let returnValue = '';

  // Process each line break
  do {
    // Check for CR (Carriage Return) before LF (Line Feed)
    const gotCR = string[index - 1] === '\r';
    // Build the new string:
    // 1. Add content up to the line break
    // 2. Add prefix
    // 3. Add appropriate line break (CRLF or LF)
    // 4. Add postfix
    returnValue +=
      string.slice(endIndex, gotCR ? index - 1 : index) +
      prefix +
      (gotCR ? '\r\n' : '\n') +
      postfix;
    // Move to next position after line break
    endIndex = index + 1;
    // eslint-disable-next-line no-param-reassign
    index = string.indexOf('\n', endIndex);
  } while (index !== -1);
  // Add remaining content
  returnValue += string.slice(endIndex);
  return returnValue;
}
