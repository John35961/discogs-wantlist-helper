const headersFrom = (params) => {
  return Object.entries(params).map(([key, value]) => `${key}="${value}"`).join(',');
}

const generateNonce = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

const parseReleaseId = (input) => {
  if (!input) return null;

  if (/^\d+$/.test(input)) return input;

  try {
    const url = new URL(input);
    const match = url.pathname.match(/\/release\/(\d+)/);

    if (match && match[1]) return match[1];
  } catch (error) {
    throw new Error("Invalid URL");
  }

  return null;
}

const parseArtists = (artists) => {
  return artists.map((artist) => { return artist.name }).join(', ');
}

export { parseArtists, parseReleaseId, headersFrom, generateNonce };
