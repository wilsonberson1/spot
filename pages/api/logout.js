import cookie from 'cookie';

export default function handler(req, res) {
  res.setHeader(
    'Set-Cookie',
    cookie.serialize('spotify_access_token', '', {
      maxAge: 0,
      path: '/'
    })
  );
  res.redirect('/');
}
