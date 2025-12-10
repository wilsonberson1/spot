import cookie from 'cookie';
import { fetchFromSpotify } from '../../../lib/spotify';
import {
  computeSpotScore,
  estimatePercentileText,
  extractGenresFromArtists,
  averagePopularity
} from '../../../lib/analytics';

export default async function handler(req, res) {
  const cookies = cookie.parse(req.headers.cookie || '');
  const accessToken = cookies.spotify_access_token;

  if (!accessToken) {
    return res.status(401).json({ error: 'not_authenticated' });
  }

  try {
    const [artistsRes, tracksRes, recentRes] = await Promise.all([
      fetchFromSpotify('/me/top/artists?limit=20&time_range=medium_term', accessToken),
      fetchFromSpotify('/me/top/tracks?limit=20&time_range=medium_term', accessToken),
      fetchFromSpotify('/me/player/recently-played?limit=50', accessToken)
    ]);

    const artists = artistsRes.items || [];
    const tracks = tracksRes.items || [];
    const recentItems = recentRes.items || [];

    const uniqueArtists = artists.length;
    const genreStats = extractGenresFromArtists(artists);
    const uniqueGenres = genreStats.length;

    const recentTracks = recentItems.map((item) => item.track);
    const totalMsRecent = recentTracks.reduce(
      (sum, t) => sum + (t.duration_ms || 0),
      0
    );
    const recentMinutes = Math.round(totalMsRecent / 60000);

    const avgPopularityTracks = averagePopularity(tracks);

    const spotScore = computeSpotScore({
      uniqueArtists,
      uniqueGenres,
      recentMinutes,
      avgTrackPopularity: avgPopularityTracks
    });

    const percentileText = estimatePercentileText(spotScore);

    const topGenres = genreStats.slice(0, 6);

    let summaryText = '';
    if (spotScore >= 900) {
      summaryText =
        'Seu perfil é extremamente musical: você combina muita diversidade, bastante tempo ouvindo e um gosto que foge bastante do óbvio.';
    } else if (spotScore >= 750) {
      summaryText =
        'Você ouve música com frequência, explora artistas variados e tem um equilíbrio entre hits populares e sons mais alternativos.';
    } else if (spotScore >= 600) {
      summaryText =
        'Você está bem na média-alta: curte seus artistas favoritos com regularidade e ainda encontra espaço para descobrir coisas novas.';
    } else if (spotScore >= 400) {
      summaryText =
        'Seu consumo musical é parecido com o de muitos ouvintes: você tem seus queridinhos, mas ainda pode explorar mais gêneros e artistas.';
    } else {
      summaryText =
        'Você escuta música com mais calma, o que não é nada ruim. Quando quiser turbinar o SpotScore, experimente explorar playlists descobertas e gêneros diferentes.';
    }

    res.status(200).json({
      spotScore,
      percentileText,
      summaryText,
      uniqueArtists,
      uniqueGenres,
      recentMinutes,
      avgTrackPopularity: Math.round(avgPopularityTracks || 0),
      topGenres
    });
  } catch (err) {
    console.error(err);
    if (err.message === 'unauthorized') {
      return res.status(401).json({ error: 'unauthorized' });
    }
    res.status(500).json({ error: 'spotify_error' });
  }
}
