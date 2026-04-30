-- Script simples para testar a inserção de inscrições

-- 1. Verificar estrutura da tabela
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'inscricoes'
ORDER BY ordinal_position;

-- 2. Teste de inserção simples (campos básicos)
INSERT INTO inscricoes (
  nome_completo,
  celular,
  email,
  tipo_de_curso,
  pagina,
  campanha,
  status
) VALUES (
  'Teste Sistema',
  '(11) 99999-9999',
  null,
  'Administração',
  'graduacao',
  null,
  'novo'
) RETURNING *;

-- 3. Verificar se inseriu
SELECT * FROM inscricoes 
WHERE nome_completo = 'Teste Sistema'
ORDER BY data_de_criacao DESC 
LIMIT 1;

-- 4. Ver últimas 5 inscrições
SELECT 
  nome_completo,
  celular,
  tipo_de_curso,
  pagina,
  status,
  data_de_criacao
FROM inscricoes 
ORDER BY data_de_criacao DESC 
LIMIT 5;

-- 5. Verificar políticas RLS
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE tablename = 'inscricoes';

-- 6. Se der erro de RLS, execute:
-- ALTER TABLE inscricoes ENABLE ROW LEVEL SECURITY;
-- 
-- DROP POLICY IF EXISTS "Permitir inserção pública de inscrições" ON inscricoes;
-- 
-- CREATE POLICY "Permitir inserção pública de inscrições" ON inscricoes
--     FOR INSERT 
--     TO anon, authenticated
--     WITH CHECK (true);

