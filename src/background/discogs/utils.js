const DISCOGS_RELEASE_REGEX = /discogs\.com\/release\/(\d+)/;
const FALLBACK_DISCOGS_RELEASE_REGEX = /%2Fwww.discogs.com%2F.+%2Frelease%2F(\d+)/;

export const parseReleaseId = (input) => {
  if (!input) return null;

  if (/^\d+$/.test(input)) return input;

  const match = input.match(DISCOGS_RELEASE_REGEX);
  if (match && match[1]) return match[1];

  let result = match && match[1] ? match[1] : null;

  const fallbackMatch = input.match(FALLBACK_DISCOGS_RELEASE_REGEX);
  result ??= fallbackMatch && fallbackMatch[1] ? fallbackMatch[1] : null;

  if (!result) {
    throw new Error("Must be a valid Discogs URL");
  };

  return result;
};
