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

export { parseArtists, parseReleaseId };
