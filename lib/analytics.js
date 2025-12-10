/**
 * Calcula o SpotScore (0–1000) baseado em:
 * - diversidade de artistas
 * - diversidade de gêneros
 * - minutos recentes
 * - quanto mais "alternativo" (menor popularidade média), maior a pontuação
 */
export function computeSpotScore({
  uniqueArtists,
  uniqueGenres,
  recentMinutes,
  avgTrackPopularity
}) {
  const ua = Math.min(uniqueArtists, 200); // limite para não explodir
  const ug = Math.min(uniqueGenres, 50);
  const rm = Math.min(recentMinutes, 600); // considera até 10h

  const altFactor = 100 - (avgTrackPopularity || 50); // se popularidade baixa, mais alternativo
  // pesos simples, mas que geram variação legal
  let score =
    200 +
    ua * 1.2 +
    ug * 4 +
    rm * 0.4 +
    altFactor * 3;

  if (score < 0) score = 0;
  if (score > 1000) score = 1000;

  return Math.round(score);
}

/**
 * Gera um texto de percentil "estimado" com base na pontuação.
 * Não é um ranking real global; é apenas uma interpretação do score.
 */
export function estimatePercentileText(score) {
  if (score >= 900) {
    return 'Você está entre os 5% de usuários mais viciados em música (estimado pelo SpotStats).';
  }
  if (score >= 750) {
    return 'Você provavelmente está acima de 20% dos ouvintes em tempo e diversidade musical.';
  }
  if (score >= 600) {
    return 'Você está na média-alta: ouve bastante música e com boa variedade.';
  }
  if (score >= 400) {
    return 'Você está na média: seu consumo musical é parecido com o de muitos ouvintes.';
  }
  return 'Seu SpotScore está abaixo da média, mas isso só significa que ainda há muito som pra descobrir.';
}

/**
 * Agrupa gêneros a partir da lista de artistas.
 */
export function extractGenresFromArtists(artists) {
  const map = new Map();

  for (const artist of artists) {
    const genres = artist.genres || [];
    for (const g of genres) {
      const key = g.toLowerCase();
      map.set(key, (map.get(key) || 0) + 1);
    }
  }

  const arr = Array.from(map.entries()).map(([name, count]) => ({
    name,
    count
  }));

  arr.sort((a, b) => b.count - a.count);
  return arr;
}

/**
 * Calcula média de popularidade das faixas.
 */
export function averagePopularity(tracks) {
  if (!tracks || tracks.length === 0) return 0;
  const sum = tracks.reduce(
    (acc, t) => acc + (typeof t.popularity === 'number' ? t.popularity : 50),
    0
  );
  return sum / tracks.length;
}
