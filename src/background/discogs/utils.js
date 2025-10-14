const headersFrom = (params) => {
  return Object.entries(params).map(([key, value]) => `${key}="${value}"`).join(',');
}

const generateNonce = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

const parseArtists = (artists) => {
  return artists.map((artist) => { return artist.name }).join(', ');
}

export { parseArtists, headersFrom, generateNonce };
