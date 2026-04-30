# API Backend - Anhanguera

Backend API para salvar inscrições do site Anhanguera em banco PostgreSQL.

## 🚀 Como usar no Easypanel

### 1. Criar novo serviço App
- No Easypanel, clique em **"+ Service"** > **"App"**
- Escolha **"GitHub"** se o código estiver no Git, ou **"Docker Compose"** para deploy manual

### 2. Configurar variáveis de ambiente

No Easypanel, adicione estas variáveis:

```
DB_HOST=nome-do-servico-postgres (ou IP interno)
DB_PORT=5432
DB_NAME=nome_do_banco
DB_USER=usuario
DB_PASSWORD=senha_segura
SECRET_TOKEN=7a8f9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a
FRONTEND_URL=https://seu-site.com
PORT=3000
```

### 3. Expor o serviço

- No Easypanel, vá em **"Domains"**
- Adicione um domínio (ex: `api.seusite.com`)
- SSL será gerado automaticamente

### 4. Testar

Acesse:
- `https://api.seusite.com/health` - Deve retornar status OK
- `https://api.seusite.com/health/db` - Deve confirmar conexão com banco

## 📡 Endpoints

### GET /health
Status da API (público)

### GET /health/db  
Status da conexão com banco (público)

### POST /api/inscricoes
Salvar inscrição (requer token no header `X-Secret-Token`)

**Body:**
```json
{
  "nome_completo": "João Silva",
  "celular": "11999999999",
  "email": "joao@email.com",
  "tipo_de_curso": "graduacao",
  "pagina": "site",
  "campanha": "google_ads",
  "nome_curso": "Administração"
}
```

## 🔒 Segurança

- Token secreto valida todas as requisições ao endpoint de inscrições
- CORS configurado para aceitar apenas domínio do frontend
- Credenciais do banco nunca são expostas no frontend

## 🛠️ Desenvolvimento Local

```bash
cd backend
npm install
cp .env.example .env
# Edite o .env com suas configurações
npm start
```

Servidor rodará em `http://localhost:3000`

