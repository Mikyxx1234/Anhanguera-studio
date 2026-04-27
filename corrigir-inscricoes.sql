-- Script para corrigir/criar a tabela de inscrições

-- 1. Verificar e adicionar colunas que podem estar faltando
DO $$ 
BEGIN
    -- Adicionar curso_nome se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'inscricoes' AND column_name = 'curso_nome'
    ) THEN
        ALTER TABLE inscricoes ADD COLUMN curso_nome TEXT;
    END IF;

    -- Adicionar modalidade se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'inscricoes' AND column_name = 'modalidade'
    ) THEN
        ALTER TABLE inscricoes ADD COLUMN modalidade TEXT;
    END IF;

    -- Adicionar updated_at se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'inscricoes' AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE inscricoes ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- 2. Garantir que a política de inserção existe e está correta
DROP POLICY IF EXISTS "Permitir inserção pública de inscrições" ON inscricoes;

CREATE POLICY "Permitir inserção pública de inscrições" ON inscricoes
    FOR INSERT 
    TO anon, authenticated
    WITH CHECK (true);

-- 3. Verificar se RLS está habilitado
ALTER TABLE inscricoes ENABLE ROW LEVEL SECURITY;

-- 4. Adicionar política de leitura para authenticated (opcional)
DROP POLICY IF EXISTS "Permitir leitura para autenticados" ON inscricoes;

CREATE POLICY "Permitir leitura para autenticados" ON inscricoes
    FOR SELECT
    TO authenticated
    USING (true);

-- 5. Testar inserção
INSERT INTO inscricoes (
  nome_completo,
  celular,
  email,
  tipo_de_curso,
  pagina,
  campanha,
  status,
  curso_nome,
  modalidade,
  data_de_criacao
) VALUES (
  'Teste Sistema',
  '(11) 98765-4321',
  null,
  'Bacharelado',
  '/graduation',
  'teste',
  'novo',
  'Administração',
  'EAD',
  NOW()
) RETURNING id, nome_completo, celular, curso_nome, data_de_criacao;

-- 6. Verificar se foi inserido
SELECT 
  id,
  nome_completo,
  celular,
  curso_nome,
  modalidade,
  data_de_criacao
FROM inscricoes 
WHERE nome_completo = 'Teste Sistema'
ORDER BY data_de_criacao DESC 
LIMIT 1;

