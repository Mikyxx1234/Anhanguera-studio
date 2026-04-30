import { Inscricao } from '../lib/supabase';
import { apiPost } from '../lib/apiProxy';

// URL do Webhook n8n
const WEBHOOK_URL = 'https://n8n-new-n8n.ca31ey.easypanel.host/webhook/leads_anhanguera';

export class InscricaoService {
  /**
   * Salva uma nova inscrição no banco de dados via API Backend
   */
  static async saveInscricao(inscricao: Inscricao): Promise<{ success: boolean; error?: any; data?: any }> {
    try {
      // Apenas os campos essenciais da tabela inscricoes
      const dadosParaInserir = {
        nome_completo: inscricao.nome_completo,
        celular: inscricao.celular,
        email: inscricao.email,
        tipo_de_curso: inscricao.tipo_de_curso,
        pagina: inscricao.pagina,
        campanha: inscricao.campanha,
        status: inscricao.status || 'novo',
        nome_curso: inscricao.nome_curso || null
      };

      console.log('📤 Enviando inscrição para API:', dadosParaInserir);

      // Chamar API Backend via proxy (protegida com rate limiting e validação de origem)
      const response = await apiPost('/api/inscricoes', dadosParaInserir);
      console.log('✅ Resposta da API:', response);

      // Enviar webhook para n8n
      try {
        const webhookData = {
          nome: inscricao.nome_completo,
          telefone: inscricao.celular,
          email: inscricao.email || null,
          curso: inscricao.nome_curso || null,
          nivel: inscricao.tipo_de_curso // graduacao, pos-graduacao ou curso-tecnico
        };

        console.log('📤 Enviando webhook para n8n:', WEBHOOK_URL);
        await fetch(WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(webhookData)
        });
        console.log('✅ Webhook enviado com sucesso');
      } catch (webhookError) {
        console.error('⚠️  Erro ao enviar webhook (continuando):', webhookError);
        // Continua mesmo se o webhook falhar
      }

      return { success: true, data: response };
    } catch (error) {
      console.error('❌ Erro ao salvar inscrição:', error);
      return { success: false, error };
    }
  }

  /**
   * Busca inscrições recentes (últimos 30 dias)
   * Função desabilitada - use o painel do DBGate para visualizar
   */
  static async getInscricoesRecentes(): Promise<Inscricao[]> {
    // Desabilitado - migração para PostgreSQL
    return [];
  }

  /**
   * Verifica se um celular já está cadastrado recentemente
   * Função desabilitada por enquanto
   */
  static async checkDuplicatePhone(_celular: string): Promise<boolean> {
    // Desabilitado - migração para PostgreSQL
    return false;
  }
}

