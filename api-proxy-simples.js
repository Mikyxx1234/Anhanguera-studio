// ========================================
// API PROXY SIMPLES - ANHANGUERA
// ========================================
// Este arquivo é TUDO que você precisa!
// Funciona igual ao Supabase, mas salva no seu PostgreSQL

const http = require('http');
const { Client } = require('pg');

// Configuração do banco (vem das variáveis de ambiente)
const DB_CONFIG = {
  host: process.env.DB_HOST || 'banco_banco',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'site_anhanguera',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  ssl: false
};

// Token secreto para proteger a API
const SECRET_TOKEN = process.env.SECRET_TOKEN || '7a8f9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a';

const PORT = process.env.PORT || 3000;

// Função para processar requisições
const server = http.createServer(async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Secret-Token');

  // Responder OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Rota: Health Check
  if (req.url === '/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      status: 'ok', 
      message: 'API Proxy funcionando!' 
    }));
    return;
  }

  // Rota: Salvar Inscrição
  if (req.url === '/api/inscricoes' && req.method === 'POST') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        // Validar token
        const token = req.headers['x-secret-token'];
        if (!token || token !== SECRET_TOKEN) {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Unauthorized' }));
          return;
        }

        // Parsear dados
        const data = JSON.parse(body);

        // Validar campos obrigatórios
        if (!data.nome_completo || !data.celular || !data.tipo_de_curso) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            error: 'Campos obrigatórios faltando',
            required: ['nome_completo', 'celular', 'tipo_de_curso']
          }));
          return;
        }

        // Conectar no banco e inserir
        const client = new Client(DB_CONFIG);
        await client.connect();

        const query = `
          INSERT INTO inscricoes (
            nome_completo, celular, email, tipo_de_curso, 
            pagina, campanha, status, nome_curso
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          RETURNING id
        `;

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

        const result = await client.query(query, values);
        await client.end();

        // Retornar sucesso
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          success: true,
          id: result.rows[0].id 
        }));

      } catch (error) {
        console.error('Erro:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          error: 'Erro ao salvar',
          details: error.message 
        }));
      }
    });

    return;
  }

  // Rota não encontrada
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Rota não encontrada' }));
});

// Iniciar servidor
server.listen(PORT, '0.0.0.0', () => {
  console.log('========================================');
  console.log('🚀 API Proxy Anhanguera iniciada!');
  console.log('========================================');
  console.log(`📡 Porta: ${PORT}`);
  console.log(`📊 Banco: ${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}`);
  console.log('========================================');
  console.log('');
  console.log('Rotas:');
  console.log('  GET  /health           - Status');
  console.log('  POST /api/inscricoes   - Salvar (requer token)');
  console.log('');
});

