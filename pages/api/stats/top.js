import cookie from 'cookie';
import { fetchFromSpotify } from '../../../lib/spotify';

export default async function handler(req, res) {
  const cookies = cookie.parse(req.headers.cookie || '');
  const accessToken = cookies.spotify_access_token;

  if (!accessToken) {
    return res.status(401).json({ error: 'not_authenticated' });
  }

  try {
    const [artistsRes, tracksRes] = await Promise.all([
      fetchFromSpotify(
        '/me/top/artists?limit=10&time_range=medium_term',
        accessToken
      ),
      fetchFromSpotify(
        '/me/top/tracks?limit=10&time_range=medium_term',
        accessToken
      )
    ]);

    const artists = (artistsRes.items || []).map((a) => ({
      id: a.id,
      name: a.name,
      genres: a.genres || [],
      image: a.images && a.images[0] ? a.images[0].url : null,
      followers: a.followers?.total || 0
    }));

    const tracks = (tracksRes.items || []).map((t) => ({
      id: t.id,
      name: t.name,
      album: t.album?.name || '',
      artists: (t.artists || []).map((ar) => ar.name),
      image: t.album?.images && t.album.images[0] ? t.album.images[0].url : null,
      duration_ms: t.duration_ms
    }));

    res.status(200).json({ artists, tracks });
  } catch (err) {
    console.error(err);
    if (err.message === 'unauthorized') {
      return res.status(401).json({ error: 'unauthorized' });
    }
    res.status(500).json({ error: 'spotify_error' });
  }
}
