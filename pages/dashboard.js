import { useEffect, useState } from 'react';
import Head from 'next/head';

export default function Dashboard() {
  const [top, setTop] = useState(null);
  const [recent, setRecent] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const resTop = await fetch('/api/stats/top');
        if (resTop.status === 401) {
          setError(
            'Você não está conectado ao Spotify. Volte para a página inicial e clique em "Entrar com Spotify".'
          );
          setLoading(false);
          return;
        }
        const jsonTop = await resTop.json();

        const resRecent = await fetch('/api/stats/recent');
        const jsonRecent = await resRecent.json();

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
  }, []);

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

        {!loading && !error && top && (
          <>
            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>Top artistas (últimos meses)</h2>
              <div style={styles.grid}>
                {top.artists.map((artist) => (
                  <div key={artist.id} style={styles.card}>
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
                  </div>
                ))}
              </div>
            </section>

            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>Top músicas (últimos meses)</h2>
              <div style={styles.grid}>
                {top.tracks.map((track) => (
                  <div key={track.id} style={styles.card}>
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
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {!loading && !error && recent && (
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Últimas reproduções</h2>
            <p style={styles.text}>
              Faixas consideradas: {recent.total_tracks} • Tempo estimado: {recent.estimated_minutes} minutos
            </p>
            <ul style={styles.list}>
              {recent.tracks.map((t) => (
                <li key={t.id + t.played_at} style={styles.listItem}>
                  <strong>{t.name}</strong> – {t.artists.join(', ')}
                  <br />
                  <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                    Álbum: {t.album} • Reproduzida em:{' '}
                    {new Date(t.played_at).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          </section>
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
    marginBottom: '12px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))',
    gap: '16px'
  },
  card: {
    backgroundColor: '#181818',
    borderRadius: '12px',
    padding: '12px'
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
  }
};
