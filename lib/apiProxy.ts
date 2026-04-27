/**
 * API Proxy - Esconde a URL real da API backend
 * 
 * Em produção (Vercel), use Vercel Rewrites no vercel.json
 * Em desenvolvimento, usa a URL direta do Easypanel
 */

const isDevelopment = import.meta.env.DEV;
const BACKEND_URL = import.meta.env.VITE_API_URL || 'https://banco-compose.6tqx2r.easypanel.host';
const SECRET_TOKEN = import.meta.env.VITE_INSCRICAO_SECRET_TOKEN || '7a8f9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a';

/**
 * Detecta se está no Bolt.new ou StackBlitz (não tem proxy)
 */
function isBoltEnvironment(): boolean {
  if (typeof window === 'undefined') return false;
  
  const hostname = window.location.hostname;
  return hostname.includes('bolt.host') || 
         hostname.includes('stackblitz.io') ||
         hostname.includes('webcontainer');
}

/**
 * Faz requisição para a API através do proxy
 * Em produção Vercel: /api/* → rewrites para Easypanel
 * Em desenvolvimento ou Bolt: diretamente para Easypanel
 */
export async function apiRequest(endpoint: string, options?: RequestInit): Promise<Response> {
  // Usar URL completa em desenvolvimento ou Bolt.new
  const url = `${BACKEND_URL}${endpoint}`;
  
  console.log('🔗 API Request:', { endpoint, url, isDevelopment, isBolt: isBoltEnvironment() });
  
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Secret-Token': SECRET_TOKEN,
      ...options?.headers,
    }
  });
}

/**
 * Helper para GET requests
 */
export async function apiGet(endpoint: string): Promise<any> {
  try {
    console.log('📡 apiGet iniciando:', endpoint);
    const response = await apiRequest(endpoint, { method: 'GET' });
    console.log('📡 apiGet resposta:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ apiGet erro:', response.status, errorText);
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('✅ apiGet sucesso:', data?.length || 'N/A', 'itens');
    return data;
  } catch (error) {
    console.error('❌ apiGet exception:', error);
    throw error;
  }
}

/**
 * Helper para POST requests
 */
export async function apiPost(endpoint: string, data: any): Promise<any> {
  const response = await apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${response.status}`);
  }
  
  return response.json();
}

