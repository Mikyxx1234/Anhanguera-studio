# 🚀 COMO ATUALIZAR A API NO EASYPANEL

## ✅ O QUE FOI FEITO

1. ✅ Criada API completa com todos os endpoints necessários
2. ✅ Atualizado `courseService.ts` - agora usa PostgreSQL
3. ✅ Atualizado `inscricaoService.ts` - já estava usando PostgreSQL

---

## 📋 ENDPOINTS DA NOVA API

```
POST   /api/inscricoes              - Salvar inscrição (protegido)
GET    /api/cursos/graduacao        - Buscar todos os cursos de graduação
GET    /api/cursos/pos              - Buscar todos os cursos de pós
GET    /api/cursos/areas            - Buscar áreas de graduação
GET    /api/cursos/pos/areas        - Buscar áreas de pós
GET    /health                      - Health check
```

---

## 🔧 PASSOS PARA ATUALIZAR NO EASYPANEL

### 1️⃣ Acesse o serviço "compose" no Easypanel

### 2️⃣ Vá na aba "Source" ou "Edit"

### 3️⃣ **DELETE TODO O CONTEÚDO** atual

### 4️⃣ Cole o novo código (está no arquivo `EASYPANEL_API_COMPLETA.yml`)

### 5️⃣ Clique em **"Deploy"**

### 6️⃣ Aguarde os logs mostrarem: **"API COMPLETA rodando na porta 3001"**

---

## ⚙️ CÓDIGO PARA COLAR NO EASYPANEL

```yaml
services:
  api:
    image: node:18-alpine
    working_dir: /app
    command: |
      sh -c "
      cat > server.js << 'EOF'
      const http = require('http');
      const { Client } = require('pg');
      
      const DB_CONFIG = {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        ssl: false
      };
      
      const SECRET_TOKEN = process.env.SECRET_TOKEN;
      const PORT = process.env.PORT || 3001;
      
      // Helper para conectar ao banco
      async function queryDB(query, values = []) {
        const client = new Client(DB_CONFIG);
        try {
          await client.connect();
          const result = await client.query(query, values);
          await client.end();
          return { success: true, data: result.rows };
        } catch (error) {
          await client.end();
          return { success: false, error: error.message };
        }
      }
      
      const server = http.createServer(async (req, res) => {
        // CORS
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Secret-Token');
        
        if (req.method === 'OPTIONS') {
          res.writeHead(200);
          res.end();
          return;
        }
        
        // Health check
        if (req.url === '/health' && req.method === 'GET') {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ status: 'ok', message: 'API funcionando!' }));
          return;
        }
        
        // POST /api/inscricoes - Salvar inscrição
        if (req.url === '/api/inscricoes' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk.toString(); });
          req.on('end', async () => {
            try {
              const token = req.headers['x-secret-token'];
              if (!token || token !== SECRET_TOKEN) {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Unauthorized' }));
                return;
              }
              
              const data = JSON.parse(body);
              if (!data.nome_completo || !data.celular || !data.tipo_de_curso) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Campos obrigatórios faltando' }));
                return;
              }
              
              const query = 'INSERT INTO inscricoes (nome_completo, celular, email, tipo_de_curso, pagina, campanha, status, nome_curso) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id';
              const values = [
                data.nome_completo,
                data.celular,
                data.email || null,
                data.tipo_de_curso,
                data.pagina || 'site',
                data.campanha || null,
                data.status || 'novo',
                data.nome_curso || null
              ];
              
              const result = await queryDB(query, values);
              
              if (result.success) {
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, id: result.data[0].id }));
              } else {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Erro ao salvar', details: result.error }));
              }
            } catch (error) {
              console.error('Erro:', error);
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Erro ao processar', details: error.message }));
            }
          });
          return;
        }
        
        // GET /api/cursos/graduacao - Buscar todos os cursos de graduação
        if (req.url === '/api/cursos/graduacao' && req.method === 'GET') {
          try {
            const query = 'SELECT * FROM cursos_grad_anhanguera ORDER BY nome ASC';
            const result = await queryDB(query);
            
            if (result.success) {
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify(result.data));
            } else {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: result.error }));
            }
          } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
          }
          return;
        }
        
        // GET /api/cursos/pos - Buscar todos os cursos de pós
        if (req.url === '/api/cursos/pos' && req.method === 'GET') {
          try {
            const query = 'SELECT * FROM cursos_pos_anhanguera ORDER BY nome_curso ASC';
            const result = await queryDB(query);
            
            if (result.success) {
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify(result.data));
            } else {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: result.error }));
            }
          } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
          }
          return;
        }
        
        // GET /api/cursos/areas - Buscar áreas de graduação
        if (req.url === '/api/cursos/areas' && req.method === 'GET') {
          try {
            const query = 'SELECT DISTINCT area FROM cursos_grad_anhanguera WHERE area IS NOT NULL ORDER BY area ASC';
            const result = await queryDB(query);
            
            if (result.success) {
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify(result.data));
            } else {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: result.error }));
            }
          } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
          }
          return;
        }
        
        // GET /api/cursos/pos/areas - Buscar áreas de pós
        if (req.url === '/api/cursos/pos/areas' && req.method === 'GET') {
          try {
            const query = 'SELECT DISTINCT area FROM cursos_pos_anhanguera WHERE area IS NOT NULL ORDER BY area ASC';
            const result = await queryDB(query);
            
            if (result.success) {
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify(result.data));
            } else {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: result.error }));
            }
          } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
          }
          return;
        }
        
        // Rota não encontrada
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Rota não encontrada' }));
      });
      
      server.listen(PORT, '0.0.0.0', () => {
        console.log('API COMPLETA rodando na porta', PORT);
      });
      EOF
      npm install pg@^8.11.3 && node server.js
      "
    ports:
      - "3001:3001"
    environment:
      DB_HOST: banco_banco
      DB_PORT: 5432
      DB_NAME: site_anhanguera
      DB_USER: postgres
      DB_PASSWORD: ^&TN5Qkg3BTXpW#eeqHj@E
      SECRET_TOKEN: 7a8f9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a
      PORT: 3001
    restart: unless-stopped
```

---

## 🧪 TESTAR OS NOVOS ENDPOINTS

Depois do deploy, teste no navegador:

### ✅ Health Check
```
http://banco-compose.6tqx2r.easypanel.host/health
```

### ✅ Buscar Cursos de Graduação
```
http://banco-compose.6tqx2r.easypanel.host/api/cursos/graduacao
```

### ✅ Buscar Cursos de Pós
```
http://banco-compose.6tqx2r.easypanel.host/api/cursos/pos
```

**Se todos retornarem JSON = API está funcionando!** ✅

---

## 🌐 TESTAR O SITE

1. **Certifique-se de ter o `.env` configurado:**

```env
VITE_API_URL=http://banco-compose.6tqx2r.easypanel.host
VITE_INSCRICAO_SECRET_TOKEN=7a8f9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a
```

2. **Reinicie o servidor:**

```bash
npm run dev
```

3. **Teste as páginas:**
   - `/graduacao` - Deve carregar os cursos
   - `/pos-mba` - Deve carregar os cursos de pós
   - Formulário "Inscreva-se" - Deve salvar no banco

4. **Verifique no DBGate** se salvou:
   ```
   https://banco-banco-dbgate.6tqx2r.easypanel.host/
   ```

---

## 🎊 PRONTO!

Agora **TUDO** está usando seu PostgreSQL no Easypanel! 🚀

