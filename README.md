# SpotStats

App em Next.js para visualizar estatísticas da sua conta Spotify (artistas e músicas mais ouvidas, últimas reproduções e tempo estimado das faixas recentes), sem salvar dados de usuário em banco. Usa apenas cookies de sessão com o access token do Spotify.

## Passos para rodar localmente

1. Crie um app em https://developer.spotify.com/dashboard
   - Configure a Redirect URI como: `http://localhost:3000/api/callback`

2. Preencha o arquivo `.env.local` (baseado em `.env.example`):

   - `SPOTIFY_CLIENT_ID=...`
   - `SPOTIFY_CLIENT_SECRET=...`
   - `SPOTIFY_REDIRECT_URI=http://localhost:3000/api/callback`
   - `APP_BASE_URL=http://localhost:3000`

3. Instale dependências e rode:

```bash
npm install
npm run dev
```

4. Acesse `http://localhost:3000` no navegador.

## Deploy na Vercel

1. Suba o projeto para um repositório (GitHub, GitLab etc.).
2. Crie um projeto na Vercel e aponte para esse repositório.
3. Nas variáveis de ambiente da Vercel, configure:

   - `SPOTIFY_CLIENT_ID`
   - `SPOTIFY_CLIENT_SECRET`
   - `SPOTIFY_REDIRECT_URI=https://SEUDOMINIO.vercel.app/api/callback`
   - `APP_BASE_URL=https://SEUDOMINIO.vercel.app`

4. Faça o deploy e atualize a Redirect URI no dashboard do Spotify para o domínio de produção.

## Observações

- Este app não salva dados pessoais em banco de dados.
- Apenas o access token é mantido em cookie de sessão por um período curto, para poder buscar as estatísticas na Spotify Web API.
- Você pode embutir o app em uma página WordPress via `<iframe>` e monetizar com Google AdSense no WordPress.
