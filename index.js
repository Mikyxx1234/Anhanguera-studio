const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Domínios permitidos
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:4173',
  'http://localhost:5174',
  'https://anhanguera.vercel.app',
  'https://anhanguera-iota.vercel.app',
  'https://soead.com.br',
  'http://soead.com.br',
  'soead.com.br',
  'vercel.app',
  'bolt.new',
  'stackblitz.com',
  'webcontainer',
  process.env.FRONTEND_URL
].filter(Boolean);

// Configurar CORS - PERMITIR TODAS AS ORIGENS
app.use(cors({
  origin: '*', // Permitir TODAS as origens
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'X-Secret-Token', 'Authorization'],
  credentials: false // Mudar para false quando origin é *
}));

app.use(express.json());

// Token secreto para proteger a API
const SECRET_TOKEN = process.env.SECRET_TOKEN || '7a8f9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a';

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
  const token = req.headers['x-secret-token'];
  
  console.log('🔑 Token recebido:', token ? token.substring(0, 20) + '...' : 'nenhum');
  console.log('🔑 Token esperado:', SECRET_TOKEN.substring(0, 20) + '...');
  
  if (!token || token !== SECRET_TOKEN) {
    console.error('❌ Token inválido ou ausente');
    return res.status(401).json({ 
      error: 'Unauthorized',
      message: 'Token secreto inválido ou ausente' 
    });
  }
  
  console.log('✅ Token validado com sucesso');
  next();
};

// Rate limiting simples (em memória)
const requestCounts = new Map();
const RATE_LIMIT = 100; // máximo de requisições (aumentado para testes)
const RATE_WINDOW = 60000; // por minuto

const rateLimiter = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  
  if (!requestCounts.has(ip)) {
    requestCounts.set(ip, []);
  }
  
  const requests = requestCounts.get(ip).filter(time => now - time < RATE_WINDOW);
  
  if (requests.length >= RATE_LIMIT) {
    return res.status(429).json({ 
      error: 'Too Many Requests',
      message: 'Limite de requisições excedido. Tente novamente em 1 minuto.' 
    });
  }
  
  requests.push(now);
  requestCounts.set(ip, requests);
  
  // Limpar IPs antigos a cada 5 minutos
  if (Math.random() < 0.01) {
    for (const [key, times] of requestCounts.entries()) {
      if (times.every(time => now - time > RATE_WINDOW * 5)) {
        requestCounts.delete(key);
      }
    }
  }
  
  next();
};

// Middleware de validação de origem (PERMISSIVO PARA DESENVOLVIMENTO)
const validateOrigin = (req, res, next) => {
  const origin = req.get('origin') || req.get('referer');
  console.log('🔍 validateOrigin - Origin:', origin);
  
  // Permitir todas as origens em desenvolvimento
  if (process.env.NODE_ENV !== 'production') {
    console.log('✅ Modo desenvolvimento - permitindo todas as origens');
    return next();
  }
  
  // Em produção, validar origem
  if (!origin) {
    console.warn('⚠️  Requisição sem origin - permitindo');
    return next();
  }
  
  // Verificar se a origem está permitida
  const isAllowed = ALLOWED_ORIGINS.some(allowed => origin.includes(allowed));
  
  if (isAllowed) {
    console.log('✅ Origin permitida:', origin);
    return next();
  }
  
  console.error('❌ Origin bloqueada:', origin);
  console.log('💡 Adicione esta origin na lista ALLOWED_ORIGINS');
  
  // PERMITIR TEMPORARIAMENTE PARA DEBUG
  return next();
  
  /* CÓDIGO ORIGINAL (COMENTADO PARA DEBUG)
  // Se for ambiente de desenvolvimento, permitir
  if (process.env.NODE_ENV === 'development') {
    return next();
  }
  
  // Permitir localhost para desenvolvimento local
  if (origin && (origin.includes('localhost') || origin.includes('127.0.0.1'))) {
    return next();
  }
  
  // Validar se a origem é permitida
  if (origin && ALLOWED_ORIGINS.some(allowed => origin.includes(allowed))) {
    return next();
  }
  
  // Se não tem origin/referer mas passou pelo CORS, permitir
  // (isso acontece em algumas situações válidas de proxy/rewrite)
  if (!origin) {
    console.warn('⚠️  Requisição sem origin/referer - permitindo');
    return next();
  }
  
  // Bloquear apenas origens desconhecidas
  console.error('❌ Origem bloqueada:', origin);
  return res.status(403).json({ 
    error: 'Forbidden',
    message: 'Origem não permitida' 
  });
  */
};

// Conexão com PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});

// Testar conexão ao iniciar
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Erro ao conectar no banco de dados:', err.stack);
  } else {
    console.log('✅ Conectado ao banco de dados PostgreSQL!');
    release();
  }
});

// ========================================
// ROTAS
// ========================================

// Rota de teste (pública)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'API Anhanguera funcionando!',
    timestamp: new Date().toISOString()
  });
});

// Testar conexão com o banco (pública)
app.get('/health/db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ 
      status: 'ok', 
      message: 'Conexão com banco OK!',
      timestamp: result.rows[0].now
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: 'Erro na conexão com banco',
      error: error.message
    });
  }
});

// Rota para salvar inscrição (protegida apenas com rate limiting)
app.post('/api/inscricoes', rateLimiter, async (req, res) => {
  console.log('📥 Recebida requisição POST /api/inscricoes');
  console.log('📋 Body:', JSON.stringify(req.body, null, 2));
  console.log('🌐 Origin:', req.get('origin'));
  console.log('🔗 Referer:', req.get('referer'));
  
  const {
    nome_completo,
    celular,
    email,
    tipo_de_curso,
    pagina,
    campanha,
    status,
    nome_curso
  } = req.body;

  // Validação básica
  if (!nome_completo || !celular || !tipo_de_curso) {
    console.error('❌ Validação falhou - campos obrigatórios faltando');
    console.error('Recebido:', { nome_completo, celular, tipo_de_curso });
    return res.status(400).json({ 
      error: 'Campos obrigatórios faltando',
      required: ['nome_completo', 'celular', 'tipo_de_curso'],
      received: { nome_completo, celular, tipo_de_curso }
    });
  }

  try {
    const query = `
      INSERT INTO inscricoes (
        nome_completo, celular, email, tipo_de_curso, 
        pagina, campanha, status, nome_curso
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id
    `;

    const values = [
      nome_completo,
      celular,
      email || null,
      tipo_de_curso,
      pagina || 'site',
      campanha || null,
      status || 'novo',
      nome_curso || null
    ];

    console.log('💾 Tentando inserir no banco:', values);
    const result = await pool.query(query, values);
    console.log('✅ Inscrição salva com sucesso! ID:', result.rows[0].id);

    res.status(201).json({ 
      success: true,
      id: result.rows[0].id 
    });
  } catch (error) {
    console.error('❌ Erro ao inserir inscrição:', error);
    console.error('Stack:', error.stack);
    res.status(500).json({ 
      error: 'Erro ao salvar inscrição',
      details: error.message 
    });
  }
});

// Rota para buscar cursos de graduação
app.get('/api/cursos/graduacao', async (req, res) => {
  try {
    const query = 'SELECT * FROM cursos_grad_anhanguera ORDER BY nome ASC';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Erro ao buscar cursos de graduação:', error);
    res.status(500).json({ 
      error: 'Erro ao buscar cursos',
      details: error.message 
    });
  }
});

// Rota para buscar cursos de pós-graduação
app.get('/api/cursos/pos', async (req, res) => {
  try {
    const query = 'SELECT * FROM cursos_pos_anhanguera ORDER BY nome_curso ASC';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Erro ao buscar cursos de pós:', error);
    res.status(500).json({ 
      error: 'Erro ao buscar cursos',
      details: error.message 
    });
  }
});

// Rota para buscar áreas de graduação
app.get('/api/cursos/areas', async (req, res) => {
  try {
    const query = 'SELECT DISTINCT area FROM cursos_grad_anhanguera WHERE area IS NOT NULL ORDER BY area ASC';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Erro ao buscar áreas:', error);
    res.status(500).json({ 
      error: 'Erro ao buscar áreas',
      details: error.message 
    });
  }
});

// Rota para buscar áreas de pós-graduação
app.get('/api/cursos/pos/areas', async (req, res) => {
  try {
    const query = 'SELECT DISTINCT area FROM cursos_pos_anhanguera WHERE area IS NOT NULL ORDER BY area ASC';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Erro ao buscar áreas de pós:', error);
    res.status(500).json({ 
      error: 'Erro ao buscar áreas',
      details: error.message 
    });
  }
});

// Rota para gravar sessão com UTMs
app.post('/api/sessions', rateLimiter, async (req, res) => {
  const {
    session_id,
    landing_page,
    first_page,
    referrer,
    device,
    user_agent,
    utm_source,
    utm_medium,
    utm_campaign,
    utm_content,
    utm_term,
    gclid,
    gbraid,
    wbraid
  } = req.body;

  if (!session_id) {
    return res.status(400).json({ error: 'session_id é obrigatório' });
  }

  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim()
    || req.socket?.remoteAddress
    || null;

  try {
    const result = await pool.query(
      `INSERT INTO anh_google_sessions (
        session_id, landing_page, first_page, referrer, device, ip, user_agent,
        utm_source, utm_medium, utm_campaign, utm_content, utm_term,
        gclid, gbraid, wbraid
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
      ON CONFLICT (session_id) DO NOTHING
      RETURNING id`,
      [
        session_id,
        landing_page || null,
        first_page || null,
        referrer || null,
        device || null,
        ip,
        user_agent || null,
        utm_source || null,
        utm_medium || null,
        utm_campaign || null,
        utm_content || null,
        utm_term || null,
        gclid || null,
        gbraid || null,
        wbraid || null
      ]
    );

    if (result.rows.length > 0) {
      res.status(201).json({ success: true, id: result.rows[0].id });
    } else {
      res.status(200).json({ success: true, message: 'Sessão já registrada' });
    }
  } catch (error) {
    console.error('Erro ao gravar sessão:', error.message);
    res.status(500).json({ error: 'Erro ao gravar sessão' });
  }
});

// Rota 404
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Rota não encontrada',
    path: req.path 
  });
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('========================================');
  console.log('🚀 API Anhanguera iniciada!');
  console.log('========================================');
  console.log(`📡 Servidor: http://0.0.0.0:${PORT}`);
  console.log(`📊 Banco: ${process.env.DB_HOST}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME}`);
  console.log(`🔒 Segurança: Rate Limiting (${RATE_LIMIT} req/min) + Origin Validation`);
  console.log(`🌐 Origins permitidos: ${ALLOWED_ORIGINS.join(', ')}`);
  console.log('========================================');
  console.log('');
  console.log('Rotas disponíveis:');
  console.log('  GET  /health                 - Status da API');
  console.log('  GET  /health/db              - Status do banco');
  console.log('  POST /api/inscricoes         - Salvar inscrição');
  console.log('  GET  /api/cursos/graduacao   - Buscar cursos de graduação');
  console.log('  GET  /api/cursos/pos         - Buscar cursos de pós');
  console.log('  GET  /api/cursos/areas       - Buscar áreas de graduação');
  console.log('  GET  /api/cursos/pos/areas   - Buscar áreas de pós');
  console.log('  POST /api/sessions           - Gravar sessão UTM');
  console.log('');
});

