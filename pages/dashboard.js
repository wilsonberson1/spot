import { useEffect, useState } from 'react';
import Head from 'next/head';

const RANGE_LABELS = {
  short_term: 'Último mês (aprox. 4 semanas)',
  medium_term: 'Últimos 6 meses',
  long_term: 'Vários anos (histórico completo)'
};

export default function Dashboard() {
  const [overview, setOverview] = useState(null);
  const [top, setTop] = useState(null);
  const [recent, setRecent] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('medium_term');

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [resOverview, resTop, resRecent] = await Promise.all([
          fetch('/api/stats/overview'),
          fetch('/api/stats/top?range=' + timeRange),
          fetch('/api/stats/recent')
        ]);

        if (resOverview.status === 401 || resTop.status === 401) {
          setError(
            'Você não está conectado ao Spotify. Volte para a página inicial e clique em "Entrar com Spotify".'
          );
          setLoading(false);
          return;
        }

        const jsonOverview = await resOverview.json();
        const jsonTop = await resTop.json();
        const jsonRecent = await resRecent.json();

        setOverview(jsonOverview);
        setTop(jsonTop);
        setRecent(jsonRecent);
      } catch (e) {
        console.error(e);
        setError('Erro ao carregar dados do Spotify. Tente novamente.');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [timeRange]);

  const handleRangeChange = (range) => {
    setTimeRange(range);
  };

  const isActiveRange = (range) =>
    timeRange === range
      ? { ...styles.rangeButton, ...styles.rangeButtonActive }
      : styles.rangeButton;

  const renderBar = (label, value, maxValue) => {
    const width = maxValue > 0 ? Math.round((value / maxValue) * 100) : 0;
    return (
      <div style={{ marginBottom: '6px' }}>
        <div style={styles.barLabelRow}>
          <span>{label}</span>
          <span style={{ opacity: 0.7 }}>{value}</span>
        </div>
        <div style={styles.barBackground}>
          <div style={{ ...styles.barFill, width: width + '%' }} />
        </div>
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>SpotStats – Seu resumo Spotify</title>
      </Head>
      <main style={styles.main}>
        <div style={styles.header}>
          <h1 style={styles.title}>SpotStats – Seu painel Spotify</h1>
          <div>
            <a href="/" style={styles.link}>
              Início
            </a>
            <a href="/api/logout" style={styles.link}>
              Sair
            </a>
          </div>
        </div>

        {loading && <p style={styles.text}>Carregando...</p>}

        {!loading && error && (
          <div style={styles.errorBox}>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && overview && (
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Seu SpotScore™</h2>
            <p style={styles.textSmall}>
              Um índice de 0 a 1000 que combina diversidade de artistas e gêneros,
              tempo escutando recentemente e quão alternativo é o seu gosto
              (baseado na popularidade das faixas).
            </p>
            <div style={styles.spotScoreRow}>
              <div style={styles.spotScoreMain}>
                <div style={styles.spotScoreNumber}>{overview.spotScore}</div>
                <div style={styles.spotScoreLabel}>SpotScore™</div>
                <div style={styles.spotScoreSubtitle}>
                  {overview.percentileText}
                </div>
              </div>
              <div style={styles.spotScoreGauge}>
                <div style={styles.barBackground}>
                  <div
                    style={{
                      ...styles.barFill,
                      width: Math.min(100, (overview.spotScore / 1000) * 100) + '%'
                    }}
                  />
                </div>
                <p style={styles.textSmall}>
                  Diversidade de artistas: {overview.uniqueArtists} • Gêneros: {overview.uniqueGenres}
                  <br />
                  Minutos recentes estimados: {overview.recentMinutes} min
                </p>
              </div>
            </div>
            <p style={styles.text}>{overview.summaryText}</p>
          </section>
        )}

        {!loading && !error && overview && overview.topGenres && (
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Seus gêneros em destaque</h2>
            <p style={styles.textSmall}>
              Baseado principalmente nos artistas mais ouvidos nos últimos meses.
            </p>
            <div style={styles.genreChips}>
              {overview.topGenres.map((g) => (
                <span key={g.name} style={styles.genreChip}>
                  {g.name} • {g.count} artista(s)
                </span>
              ))}
            </div>
          </section>
        )}

        {!loading && !error && recent && (
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Seus horários musicais</h2>
            <p style={styles.text}>
              Faixas consideradas: {recent.total_tracks} •
              {' '}
              Tempo estimado dessas faixas: {recent.estimated_minutes} minutos
            </p>

            <div style={styles.subSection}>
              <h3 style={styles.subTitle}>Por horário do dia</h3>
              <p style={styles.textSmall}>
                Veja em quais horários você mais costuma ouvir música (baseado no histórico recente).
              </p>
              {(() => {
                const hours = recent.hours || [];
                const max = hours.reduce((m, v) => (v > m ? v : m), 0);
                return hours.map((value, hour) =>
                  value > 0
                    ? renderBar(
                        `${hour.toString().padStart(2, '0')}:00`,
                        value,
                        max
                      )
                    : null
                );
              })()}
            </div>

            <div style={styles.subSection}>
              <h3 style={styles.subTitle}>Por dia da semana</h3>
              {(() => {
                const days = recent.weekdays || [];
                const labels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
                const max = days.reduce((m, v) => (v > m ? v : m), 0);
                return days.map((value, idx) =>
                  value > 0
                    ? renderBar(labels[idx], value, max)
                    : null
                );
              })()}
            </div>
          </section>
        )}

        {!loading && !error && (
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Período para Top artistas e músicas</h2>
            <p style={styles.textSmall}>
              Os períodos são aproximados, de acordo com a API oficial do Spotify.
            </p>
            <div style={styles.rangeSwitcher}>
              <button
                type="button"
                style={isActiveRange('short_term')}
                onClick={() => handleRangeChange('short_term')}
              >
                Último mês
              </button>
              <button
                type="button"
                style={isActiveRange('medium_term')}
                onClick={() => handleRangeChange('medium_term')}
              >
                Últimos 6 meses
              </button>
              <button
                type="button"
                style={isActiveRange('long_term')}
                onClick={() => handleRangeChange('long_term')}
              >
                Histórico completo
              </button>
            </div>
            <p style={styles.textSmall}>
              Período atual: <strong>{RANGE_LABELS[timeRange]}</strong>
            </p>
          </section>
        )}

        {!loading && !error && top && (
          <>
            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>Top artistas</h2>
              <div style={styles.grid}>
                {top.artists.map((artist, index) => (
                  <div key={artist.id} style={styles.card}>
                    <div style={styles.rankBadge}>#{index + 1}</div>
                    {artist.image && (
                      <img
                        src={artist.image}
                        alt={artist.name}
                        style={styles.image}
                      />
                    )}
                    <h3 style={styles.cardTitle}>{artist.name}</h3>
                    {artist.genres && artist.genres.length > 0 && (
                      <p style={styles.textSmall}>
                        {artist.genres.slice(0, 3).join(', ')}
                      </p>
                    )}
                    {typeof artist.popularity === 'number' && (
                      <p style={styles.textSmall}>
                        Popularidade global: {artist.popularity}/100
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>Top músicas</h2>
              <div style={styles.grid}>
                {top.tracks.map((track, index) => (
                  <div key={track.id} style={styles.card}>
                    <div style={styles.rankBadge}>#{index + 1}</div>
                    {track.image && (
                      <img
                        src={track.image}
                        alt={track.name}
                        style={styles.image}
                      />
                    )}
                    <h3 style={styles.cardTitle}>{track.name}</h3>
                    <p style={styles.textSmall}>
                      {track.artists.join(', ')}
                      <br />
                      <span style={{ opacity: 0.7 }}>{track.album}</span>
                    </p>
                    {typeof track.popularity === 'number' && (
                      <p style={styles.textSmall}>
                        Popularidade global: {track.popularity}/100
                      </p>
                    )}
                    <p style={styles.textSmall}>
                      Duração: {Math.round(track.duration_ms / 60000)} min
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </>
  );
}

const styles = {
  main: {
    minHeight: '100vh',
    padding: '24px',
    backgroundColor: '#000',
    color: '#fff',
    maxWidth: '960px',
    margin: '0 auto'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px'
  },
  title: {
    fontSize: '1.8rem'
  },
  link: {
    color: '#1db954',
    marginLeft: '12px',
    textDecoration: 'none',
    fontSize: '0.95rem'
  },
  section: {
    marginTop: '24px'
  },
  sectionTitle: {
    fontSize: '1.3rem',
    marginBottom: '8px'
  },
  subSection: {
    marginTop: '16px'
  },
  subTitle: {
    fontSize: '1.05rem',
    marginBottom: '4px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))',
    gap: '16px'
  },
  card: {
    position: 'relative',
    backgroundColor: '#181818',
    borderRadius: '12px',
    padding: '12px',
    overflow: 'hidden'
  },
  rankBadge: {
    position: 'absolute',
    top: '8px',
    left: '8px',
    backgroundColor: '#1db954',
    color: '#000',
    borderRadius: '999px',
    padding: '2px 10px',
    fontSize: '0.75rem',
    fontWeight: 'bold'
  },
  cardTitle: {
    fontSize: '1rem',
    marginTop: '8px',
    marginBottom: '4px'
  },
  image: {
    width: '100%',
    borderRadius: '8px'
  },
  text: {
    fontSize: '0.95rem'
  },
  textSmall: {
    fontSize: '0.85rem',
    opacity: 0.9
  },
  list: {
    listStyle: 'none',
    padding: 0,
    marginTop: '12px'
  },
  listItem: {
    padding: '8px 0',
    borderBottom: '1px solid #333'
  },
  errorBox: {
    backgroundColor: '#331111',
    borderRadius: '8px',
    padding: '12px',
    marginTop: '8px'
  },
  rangeSwitcher: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '8px',
    marginBottom: '4px'
  },
  rangeButton: {
    padding: '6px 12px',
    borderRadius: '999px',
    border: '1px solid #333',
    backgroundColor: '#111',
    color: '#fff',
    fontSize: '0.85rem',
    cursor: 'pointer'
  },
  rangeButtonActive: {
    backgroundColor: '#1db954',
    color: '#000',
    borderColor: '#1db954'
  },
  barBackground: {
    width: '100%',
    height: '8px',
    borderRadius: '999px',
    backgroundColor: '#222',
    overflow: 'hidden'
  },
  barFill: {
    height: '100%',
    borderRadius: '999px',
    backgroundColor: '#1db954'
  },
  barLabelRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.8rem',
    marginBottom: '2px'
  },
  genreChips: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '8px'
  },
  genreChip: {
    padding: '4px 10px',
    borderRadius: '999px',
    backgroundColor: '#181818',
    fontSize: '0.8rem'
  },
  spotScoreRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    alignItems: 'center',
    margin: '12px 0'
  },
  spotScoreMain: {
    minWidth: '140px',
    textAlign: 'center'
  },
  spotScoreNumber: {
    fontSize: '2.6rem',
    fontWeight: 'bold'
  },
  spotScoreLabel: {
    fontSize: '0.9rem',
    opacity: 0.9
  },
  spotScoreSubtitle: {
    fontSize: '0.85rem',
    opacity: 0.9,
    marginTop: '4px'
  },
  spotScoreGauge: {
    flex: 1,
    minWidth: '200px'
  }
};
