import cookie from 'cookie';
import crypto from 'crypto';

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;
const SCOPES = ['user-top-read', 'user-read-recently-played'].join(' ');

export default async function handler(req, res) {
  if (!CLIENT_ID || !REDIRECT_URI) {
    return res
      .status(500)
      .json({ error: 'Configuração SPOTIFY_CLIENT_ID/REDIRECT_URI ausente' });
  }

  const state = crypto.randomBytes(16).toString('hex');

  res.setHeader(
    'Set-Cookie',
    cookie.serialize('spotify_auth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 300,
      path: '/'
    })
  );

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID,
    scope: SCOPES,
    redirect_uri: REDIRECT_URI,
    state
  });

  const authorizeUrl =
    'https://accounts.spotify.com/authorize?' + params.toString();

  res.redirect(authorizeUrl);
}
