export async function fetchFromSpotify(path, accessToken) {
  const res = await fetch('https://api.spotify.com/v1' + path, {
    headers: {
      Authorization: 'Bearer ' + accessToken
    }
  });

  if (res.status === 401) {
    throw new Error('unauthorized');
  }

  if (!res.ok) {
    const text = await res.text();
    console.error('Spotify API error', res.status, text);
    throw new Error('spotify_error');
  }

  return res.json();
}
