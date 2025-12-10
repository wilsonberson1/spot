import cookie from 'cookie';
import { fetchFromSpotify } from '../../../lib/spotify';

export default async function handler(req, res) {
  const cookies = cookie.parse(req.headers.cookie || '');
  const accessToken = cookies.spotify_access_token;

  if (!accessToken) {
    return res.status(401).json({ error: 'not_authenticated' });
  }

  try {
    const recentRes = await fetchFromSpotify(
      '/me/player/recently-played?limit=50',
      accessToken
    );

    const items = recentRes.items || [];

    const tracks = items.map((item) => ({
      id: item.track.id,
      name: item.track.name,
      album: item.track.album?.name || '',
      artists: (item.track.artists || []).map((a) => a.name),
      played_at: item.played_at,
      duration_ms: item.track.duration_ms
    }));

    const totalMs = tracks.reduce(
      (sum, t) => sum + (t.duration_ms || 0),
      0
    );
    const totalMinutes = Math.round(totalMs / 60000);

    // distribuição por hora
    const hours = new Array(24).fill(0);
    const weekdays = new Array(7).fill(0);

    for (const t of tracks) {
      const date = new Date(t.played_at);
      const h = date.getHours();
      const d = date.getDay(); // 0 = domingo
      hours[h] += 1;
      weekdays[d] += 1;
    }

    res.status(200).json({
      total_tracks: tracks.length,
      estimated_minutes: totalMinutes,
      tracks,
      hours,
      weekdays
    });
  } catch (err) {
    console.error(err);
    if (err.message === 'unauthorized') {
      return res.status(401).json({ error: 'unauthorized' });
    }
    res.status(500).json({ error: 'spotify_error' });
  }
}
