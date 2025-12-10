import cookie from 'cookie';

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;

export default async function handler(req, res) {
  const { code, state } = req.query;

  if (!code || !state) {
    return res.status(400).send('Parâmetros inválidos do Spotify');
  }

  const cookies = cookie.parse(req.headers.cookie || '');
  const storedState = cookies.spotify_auth_state;

  if (!storedState || storedState !== state) {
    return res.status(400).send('Falha de validação de state (possível CSRF).');
  }

  res.setHeader(
    'Set-Cookie',
    cookie.serialize('spotify_auth_state', '', {
      maxAge: 0,
      path: '/'
    })
  );

  const basicAuth = Buffer.from(
    `${CLIENT_ID}:${CLIENT_SECRET}`
  ).toString('base64');

  try {
    const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${basicAuth}`
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI
      })
    });

    const data = await tokenRes.json();

    if (!tokenRes.ok) {
      console.error('Erro ao trocar code por token:', data);
      return res.status(500).send('Erro ao autenticar com Spotify');
    }

    const accessToken = data.access_token;
    const maxAge = data.expires_in || 3600;

    res.setHeader(
      'Set-Cookie',
      cookie.serialize('spotify_access_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge,
        path: '/'
      })
    );

    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro interno na autenticação com Spotify');
  
  }
}
