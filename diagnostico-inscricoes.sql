-- Script de diagnóstico para verificar a tabela de inscrições

-- 1. Verificar se a tabela existe
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public'
   AND table_name = 'inscricoes'
) as tabela_existe;

-- 2. Ver estrutura da tabela
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'inscricoes'
ORDER BY ordinal_position;

-- 3. Verificar políticas RLS
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'inscricoes';

-- 4. Verificar se RLS está habilitado
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename = 'inscricoes';

-- 5. Testar inserção manual
INSERT INTO inscricoes (
  nome_completo,
  celular,
  email,
  tipo_de_curso,
  pagina,
  campanha,
  status,
  curso_nome,
  modalidade
) VALUES (
  'Teste Manual',
  '(11) 99999-9999',
  null,
  'Teste',
  '/test',
  null,
  'novo',
  'Teste Curso',
  'EAD'
) RETURNING *;

-- 6. Ver últimas inscrições
SELECT * FROM inscricoes 
ORDER BY data_de_criacao DESC 
LIMIT 5;

