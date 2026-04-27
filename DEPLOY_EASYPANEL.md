# 🚀 DEPLOY NO EASYPANEL - API SEGURA

## 📋 MUDANÇAS IMPLEMENTADAS:

### ✅ **SEGURANÇA MELHORADA:**
1. ❌ **Removido** token secreto visível no frontend
2. ✅ **Adicionado** validação de origem (Origin/Referer)
3. ✅ **Adicionado** rate limiting (10 requisições/minuto por IP)
4. ✅ **CORS restritivo** apenas para domínios permitidos

### 🔒 **FLUXO ATUAL:**
```
Frontend → Backend (valida origin + rate limit) → PostgreSQL → Backend → Frontend
```

---

## 🛠️ **PASSOS PARA DEPLOY:**

### **1. ATUALIZAR O CÓDIGO NO EASYPANEL**

Você tem 2 opções:

#### **OPÇÃO A: Docker Compose (Recomendado)**

1. **No Easypanel, edite seu app `compose`**
2. **Substitua todo o conteúdo do Docker Compose por:**

```yaml
services:
  api:
    build:
      context: https://github.com/SEU_USUARIO/SEU_REPO.git#main:backend
    ports:
      - "3001:3001"
    environment:
      PORT: 3001
      NODE_ENV: production
      
      # Configurações do Banco de Dados
      DB_HOST: banco_banco
      DB_PORT: 5432
      DB_NAME: site_anhanguera
      DB_USER: postgres
      DB_PASSWORD: ^&TN5Qkg3BTXpW#eeqHj@E
      DB_SSL: false
      
      # URL do Frontend (para validação de origem)
      FRONTEND_URL: https://seu-site.vercel.app
    restart: unless-stopped
```

#### **OPÇÃO B: Upload Manual**

1. **Faça upload dos arquivos do diretório `backend/` para o Easypanel:**
   - `backend/index.js`
   - `backend/package.json`
   - `backend/Dockerfile`

2. **Configure as variáveis de ambiente:**

---

### **2. CONFIGURAR VARIÁVEIS DE AMBIENTE**

No Easypanel, adicione estas variáveis:

```bash
PORT=3001
NODE_ENV=production

# Banco de dados
DB_HOST=banco_banco
DB_PORT=5432
DB_NAME=site_anhanguera
DB_USER=postgres
DB_PASSWORD=^&TN5Qkg3BTXpW#eeqHj@E
DB_SSL=false

# Frontend (IMPORTANTE!)
FRONTEND_URL=https://seu-site.vercel.app
```

⚠️ **IMPORTANTE:** Substitua `https://seu-site.vercel.app` pela URL real do seu site!

---

### **3. FAZER DEPLOY**

1. Clique em **"Deploy"** no Easypanel
2. Aguarde o build terminar
3. Verifique os logs para garantir que iniciou corretamente

---

### **4. TESTAR A API**

#### **Teste 1: Health Check**
```bash
curl https://banco-compose.6tqx2r.easypanel.host/health
```

**Resposta esperada:**
```json
{
  "status": "ok",
  "message": "API Anhanguera funcionando!",
  "timestamp": "2025-10-28T..."
}
```

#### **Teste 2: Conexão com Banco**
```bash
curl https://banco-compose.6tqx2r.easypanel.host/health/db
```

**Resposta esperada:**
```json
{
  "status": "ok",
  "message": "Conexão com banco OK!",
  "timestamp": "2025-10-28T..."
}
```

#### **Teste 3: Inserir Inscrição (do site)**

Preencha o formulário no site e verifique se:
- ✅ Dados são salvos no banco
- ✅ **NÃO** aparece token nos DevTools
- ✅ Webhook n8n é disparado

---

## 🔐 **VALIDAÇÕES DE SEGURANÇA:**

### **O que está protegido agora:**

1. **Validação de Origem:**
   - ✅ Apenas requisições do seu site são aceitas
   - ❌ Requisições diretas via Postman são **BLOQUEADAS** (em produção)
   - ❌ Requisições de outros domínios são **BLOQUEADAS**

2. **Rate Limiting:**
   - ✅ Máximo de 10 requisições por minuto por IP
   - ❌ IPs que ultrapassarem o limite recebem erro 429

3. **CORS Restritivo:**
   - ✅ Apenas domínios em `ALLOWED_ORIGINS` podem acessar
   - ❌ Outros domínios recebem erro CORS

---

## 🧪 **TESTE DE SEGURANÇA:**

### **Teste 1: Bloquear requisições diretas (Postman)**

```bash
curl -X POST https://banco-compose.6tqx2r.easypanel.host/api/inscricoes \
  -H "Content-Type: application/json" \
  -d '{"nome_completo":"Teste","celular":"11999999999","tipo_de_curso":"graduacao"}'
```

**Resposta esperada em PRODUÇÃO:**
```json
{
  "error": "Forbidden",
  "message": "Acesso direto à API não permitido"
}
```

### **Teste 2: Verificar rate limiting**

Faça 11 requisições rápidas seguidas. A 11ª deve retornar:

```json
{
  "error": "Too Many Requests",
  "message": "Limite de requisições excedido. Tente novamente em 1 minuto."
}
```

---

## 📊 **ORIGENS PERMITIDAS:**

Por padrão, estas origens estão permitidas:

```javascript
- http://localhost:5173  (desenvolvimento)
- http://localhost:4173  (preview)
- https://anhanguera.vercel.app
- process.env.FRONTEND_URL  (configurável)
```

### **Para adicionar mais domínios:**

Edite `backend/index.js` linha 10:

```javascript
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:4173',
  'https://anhanguera.vercel.app',
  'https://seu-outro-dominio.com',  // ← Adicione aqui
  process.env.FRONTEND_URL
].filter(Boolean);
```

---

## 🆘 **TROUBLESHOOTING:**

### **Erro: "CORS policy: Origin não permitido"**

**Causa:** Seu domínio não está em `ALLOWED_ORIGINS`

**Solução:**
1. Adicione seu domínio em `backend/index.js`
2. OU configure `FRONTEND_URL` nas variáveis de ambiente
3. Faça redeploy

### **Erro: "Too Many Requests"**

**Causa:** Ultrapassou 10 requisições/minuto

**Solução:**
- Aguarde 1 minuto
- OU aumente `RATE_LIMIT` em `backend/index.js` linha 38

### **Erro: "Acesso direto à API não permitido"**

**Causa:** Requisição sem Origin/Referer header (ex: Postman)

**Solução:**
- Em **produção**, isso é o esperado! ✅
- Em **desenvolvimento**, configure `NODE_ENV=development`

---

## 📝 **LOGS ESPERADOS:**

Ao iniciar a API, você deve ver:

```
========================================
🚀 API Anhanguera iniciada!
========================================
📡 Servidor: http://0.0.0.0:3001
📊 Banco: banco_banco:5432/site_anhanguera
🔒 Segurança: Rate Limiting (10 req/min) + Origin Validation
🌐 Origins permitidos: http://localhost:5173, https://...
========================================

Rotas disponíveis:
  GET  /health                 - Status da API
  GET  /health/db              - Status do banco
  POST /api/inscricoes         - Salvar inscrição
  GET  /api/cursos/graduacao   - Buscar cursos de graduação
  GET  /api/cursos/pos         - Buscar cursos de pós
  GET  /api/cursos/areas       - Buscar áreas de graduação
  GET  /api/cursos/pos/areas   - Buscar áreas de pós
```

---

## ✅ **CHECKLIST FINAL:**

- [ ] Backend deployado no Easypanel
- [ ] Variáveis de ambiente configuradas
- [ ] `FRONTEND_URL` aponta para o domínio correto
- [ ] `/health` retorna 200 OK
- [ ] `/health/db` retorna 200 OK
- [ ] Formulário do site salva dados no banco
- [ ] **Token NÃO aparece** nos DevTools
- [ ] Requisições diretas via Postman são bloqueadas
- [ ] Webhook n8n funciona

---

## 🎉 **PRONTO!**

Sua API agora está:
- ✅ **Segura** (sem token exposto)
- ✅ **Protegida** (rate limiting + validação de origem)
- ✅ **Funcional** (salva dados no PostgreSQL)
- ✅ **Integrada** (webhook n8n ativo)

**Qualquer dúvida, consulte os logs no Easypanel!** 📊
