# SpotStats v3

Versão 3 do SpotStats, focada em experiência mais rica e impacto visual para viralizar e gerar tráfego recorrente:

- **SpotScore™ (0–1000)**: índice que combina diversidade de artistas, diversidade de gêneros, minutos recentes escutados e quão alternativo é o gosto (popularidade média das faixas).
- **Texto de percentil estimado**: descrição amigável indicando se o usuário está abaixo, na média ou acima da média dos ouvintes (estimado, não é ranking real global).
- **Top gêneros**: agrupamento de gêneros com base nos artistas mais ouvidos.
- **Horários musicais**: distribuição de faixas ouvidas por hora do dia e dia da semana.
- **Top artistas e Top músicas** com escolha de período:
  - Último mês (`short_term`)
  - Últimos 6 meses (`medium_term`)
  - Histórico completo (`long_term`)
- Nenhum dado pessoal é salvo em banco de dados. Apenas o access token é mantido temporariamente em cookie de sessão.

## Estrutura básica

- `pages/index.js` – Landing com call to action para login via Spotify.
- `pages/dashboard.js` – Painel completo com SpotScore, gêneros, horários e tops.
- `pages/api/login.js` – Inicia OAuth com o Spotify.
- `pages/api/callback.js` – Recebe o código do Spotify e troca por access token.
- `pages/api/logout.js` – Limpa o cookie de sessão.
- `pages/api/stats/top.js` – Top artistas e músicas com `time_range`.
- `pages/api/stats/recent.js` – Histórico recente + minutos estimados + distribuição de horários.
- `pages/api/stats/overview.js` – Cálculo do SpotScore, gêneros e resumo geral.
- `lib/spotify.js` – Helper para chamadas à Spotify Web API.
- `lib/analytics.js` – Funções de cálculo de score, gêneros e popularidade média.

## Rodando localmente

1. Crie um app em https://developer.spotify.com/dashboard
   - Configure a Redirect URI como: `http://localhost:3000/api/callback`

2. Copie `.env.example` para `.env.local` e preencha com:

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

## Observações importantes

- A API do Spotify **não** fornece um total absoluto de minutos ouvidos na vida inteira nem um ranking global real de ouvintes.
- O SpotScore™ é uma métrica criada pelo SpotStats, baseada apenas nos dados do próprio usuário (top artistas, top músicas e histórico recente), e a interpretação de "percentil" é apenas estimada.
- Apesar de o app não salvar dados de usuário em banco de dados, você pode embutir o painel em uma página WordPress via `<iframe>` e monetizar com Google AdSense no WordPress.
