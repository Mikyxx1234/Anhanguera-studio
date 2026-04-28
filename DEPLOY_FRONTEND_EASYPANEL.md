# Deploy do Frontend (Vite/React) no EasyPanel

Este projeto é um SPA (Single Page Application) construído com **Vite + React + React Router**.
O deploy usa um `Dockerfile` multi-stage que compila os estáticos e os serve via **nginx**.

---

## 1. Estrutura usada no deploy

| Arquivo | Função |
|---|---|
| `Dockerfile` | Build multi-stage: 1) Node compila o Vite, 2) nginx serve `dist/` |
| `nginx.conf` | Config nginx com fallback SPA (`try_files ... /index.html`) |
| `.dockerignore` | Ignora `node_modules`, `.env`, backend, SQL, etc |
| `package.json` | Scripts `build` e `dev` (não há `start` — quem serve é o nginx) |

**Porta exposta:** `80` (dentro do container).

---

## 2. Como configurar no EasyPanel

### Passo a passo

1. **Crie um novo serviço** do tipo **App** no EasyPanel.
2. Em **Source**, escolha **GitHub** e aponte para:
   - Repositório: `Mikyxx1234/Anhanguera-studio`
   - Branch: `main`
3. Em **Build**, escolha **Dockerfile** (não use Nixpacks/Heroku Buildpacks).
   - Dockerfile path: `Dockerfile` (na raiz)
4. Em **Network/Ports**, exponha a **porta 80**.
5. Em **Environment** configure as variáveis abaixo (todas são **build-time**, pois o Vite embute no bundle):

   | Variável | Obrigatória? | Valor |
   |---|---|---|
   | `VITE_SITE_URL` | Sim | URL pública final (ex: `https://app.soead.com.br`). Usada pelo SEO/Open Graph. |
   | `VITE_SUPABASE_URL` | Sim | URL do projeto Supabase (`https://xxxxx.supabase.co`) |
   | `VITE_SUPABASE_ANON_KEY` | Sim | Chave **anon** (pública) do Supabase |
   | `GEMINI_API_KEY` | Opcional | Só se usar funcionalidades de IA (Gemini) |

   > **IMPORTANTE:** essas variáveis precisam estar definidas **na hora do build**.
   > Se alterar qualquer uma depois, é necessário **rebuildar o container** — restart sozinho não basta.
   > No EasyPanel, configure em **Environment**; o Docker passa automaticamente para o `ENV` do estágio builder via `ARG`.
6. Clique em **Deploy**.

### Domínio

- Em **Domains**, adicione seu domínio (ex.: `app.soead.com.br`) e ative HTTPS (Let's Encrypt).
- O EasyPanel faz proxy reverso na porta 80 do container.

---

## 3. Healthcheck

O nginx expõe `/healthz` retornando `200 ok`.
Configure no EasyPanel:

- **Path**: `/healthz`
- **Port**: `80`

---

## 4. Troubleshooting

### "npm ERR! missing script: start"
Resolvido. O Dockerfile não usa mais `npm start` — agora usa `nginx`.

### Build falha em `npm run build`
Confirme que o `package-lock.json` está versionado no Git e que **não** existe `--production` no `npm ci` (quem builda precisa das devDependencies como `vite`, `typescript`, `tailwindcss`).

### Rotas (`/cursos-tecnicos`, `/blog/...`) dão 404 ao recarregar
Isso seria sintoma de não ter o fallback SPA. O `nginx.conf` deste repo já cuida disso com:
```
location / { try_files $uri $uri/ /index.html; }
```

### Variáveis de ambiente do Vite não aparecem em produção
Lembre-se: tudo que `vite.config.ts` injeta via `define` é **substituído em build time**.
Mudou a chave? Precisa **rebuildar** o container, não basta restart.

---

## 5. Build local (teste antes de subir)

```bash
docker build -t anhanguera-frontend .
docker run --rm -p 8080:80 anhanguera-frontend
# acesse http://localhost:8080
```

Para passar todas as variáveis em build-time:

```bash
docker build \
  --build-arg VITE_SITE_URL=https://app.soead.com.br \
  --build-arg VITE_SUPABASE_URL=https://SEU_PROJETO.supabase.co \
  --build-arg VITE_SUPABASE_ANON_KEY=eyJhbGciOi... \
  --build-arg GEMINI_API_KEY=sua_chave_opcional \
  -t anhanguera-frontend .
```
