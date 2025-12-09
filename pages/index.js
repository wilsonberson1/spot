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
            Veja seus artistas e músicas mais ouvidos a qualquer momento,
            sem esperar o Spotify Wrapped e sem salvar nenhum dado seu.
          </p>

          <a href="/api/login" style={styles.button}>
            Entrar com Spotify
          </a>

          <p style={styles.info}>
            O SpotStats usa a API oficial do Spotify, não armazena seus dados em banco
            e usa apenas cookies de sessão para buscar suas estatísticas em tempo real.
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
    maxWidth: '520px',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 18px 40px rgba(0,0,0,0.6)',
    color: '#fff',
    textAlign: 'center'
  },
  title: {
    fontSize: '2rem',
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
