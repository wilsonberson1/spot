import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>SpotStats – Seu resumo Spotify on-demand</title>
      </Head>
      <main style={styles.main}>
        <div style={styles.card}>
          <h1 style={styles.title}>SpotStats</h1>
          <p style={styles.subtitle}>
            Veja seus artistas, músicas, gêneros e horários mais ouvidos a qualquer momento,
            sem esperar o Spotify Wrapped e sem salvar nenhum dado seu em banco.
          </p>

          <a href="/api/login" style={styles.button}>
            Entrar com Spotify
          </a>

          <p style={styles.info}>
            O SpotStats usa a API oficial do Spotify, não armazena suas músicas, e apenas
            mantém um token de sessão temporário para montar seu painel.
          </p>
        </div>
      </main>
    </>
  );
}

const styles = {
  main: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background:
      'radial-gradient(circle at top, #1db954 0, #121212 50%, #000 100%)',
    padding: '16px'
  },
  card: {
    maxWidth: '620px',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.85)',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 18px 40px rgba(0,0,0,0.6)',
    color: '#fff',
    textAlign: 'center'
  },
  title: {
    fontSize: '2.4rem',
    marginBottom: '8px'
  },
  subtitle: {
    fontSize: '1rem',
    opacity: 0.9,
    marginBottom: '24px'
  },
  button: {
    display: 'inline-block',
    backgroundColor: '#1db954',
    color: '#000',
    padding: '12px 24px',
    borderRadius: '999px',
    fontWeight: 'bold',
    textDecoration: 'none',
    marginBottom: '16px'
  },
  info: {
    fontSize: '0.85rem',
    opacity: 0.8
  }
};
