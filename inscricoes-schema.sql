-- Estrutura da tabela de inscrições (leads)
-- Execute este script no SQL Editor do Supabase se a tabela ainda não existir

CREATE TABLE IF NOT EXISTS public.inscricoes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome_completo TEXT NOT NULL,
  celular TEXT NOT NULL,
  email TEXT,
  tipo_de_curso TEXT NOT NULL,
  pagina TEXT NOT NULL,
  campanha TEXT,
  status TEXT DEFAULT 'novo',
  data_de_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  curso_nome TEXT,
  modalidade TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_inscricoes_celular ON public.inscricoes(celular);
CREATE INDEX IF NOT EXISTS idx_inscricoes_data_criacao ON public.inscricoes(data_de_criacao);
CREATE INDEX IF NOT EXISTS idx_inscricoes_status ON public.inscricoes(status);
CREATE INDEX IF NOT EXISTS idx_inscricoes_curso_nome ON public.inscricoes(curso_nome);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_inscricoes_updated_at 
  BEFORE UPDATE ON inscricoes
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- View de inscrições recentes (últimos 30 dias)
CREATE OR REPLACE VIEW public.inscricoes_recentes AS
SELECT
  id,
  nome_completo,
  celular,
  email,
  tipo_de_curso,
  pagina,
  campanha,
  status,
  data_de_criacao,
  curso_nome,
  modalidade
FROM
  inscricoes
WHERE
  data_de_criacao >= (NOW() - INTERVAL '30 days')
ORDER BY
  data_de_criacao DESC;

-- Habilitar RLS (Row Level Security)
ALTER TABLE inscricoes ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserção pública (necessário para o site salvar leads)
CREATE POLICY "Permitir inserção pública de inscrições" ON inscricoes
    FOR INSERT 
    WITH CHECK (true);

-- Política para leitura apenas de administradores (opcional)
-- Descomente se quiser que apenas usuários autenticados possam ler
-- CREATE POLICY "Permitir leitura de inscrições para admin" ON inscricoes
--     FOR SELECT
--     USING (auth.role() = 'authenticated');

-- Se você quiser permitir leitura pública da view (para dashboards, etc)
-- Descomente a linha abaixo:
-- GRANT SELECT ON inscricoes_recentes TO anon;

-- Comentários para documentação
COMMENT ON TABLE inscricoes IS 'Tabela de leads/inscrições do site';
COMMENT ON COLUMN inscricoes.nome_completo IS 'Nome completo do lead';
COMMENT ON COLUMN inscricoes.celular IS 'Telefone celular com DDD';
COMMENT ON COLUMN inscricoes.tipo_de_curso IS 'Tipo do curso de interesse';
COMMENT ON COLUMN inscricoes.pagina IS 'Página onde o lead foi capturado';
COMMENT ON COLUMN inscricoes.campanha IS 'Campanha UTM se houver';
COMMENT ON COLUMN inscricoes.status IS 'Status do lead: novo, contatado, convertido, perdido';
COMMENT ON COLUMN inscricoes.curso_nome IS 'Nome do curso de interesse';
COMMENT ON COLUMN inscricoes.modalidade IS 'Modalidade escolhida: EAD, Presencial, etc';

