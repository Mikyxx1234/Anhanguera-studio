-- ========================================
-- SEGURANÇA ULTRA MÁXIMA - BLOQUEIO TOTAL
-- ========================================
-- 🔒 NINGUÉM pode fazer NADA via API REST direta
-- ✅ Apenas Edge Functions podem inserir dados
-- ✅ Site usa Edge Function protegida com token secreto

-- 1. Remover TODAS as políticas existentes
DROP POLICY IF EXISTS "Permitir inserção pública de inscrições" ON inscricoes;
DROP POLICY IF EXISTS "Permitir leitura de inscrições para admin" ON inscricoes;
DROP POLICY IF EXISTS "Enable insert for anon users" ON inscricoes;
DROP POLICY IF EXISTS "Enable read access for all users" ON inscricoes;
DROP POLICY IF EXISTS "Public insert access" ON inscricoes;
DROP POLICY IF EXISTS "Permitir apenas inserção pública" ON inscricoes;
DROP POLICY IF EXISTS "Permitir leitura apenas para admin autenticado" ON inscricoes;
DROP POLICY IF EXISTS "Site pode inserir apenas" ON inscricoes;

-- 2. ATIVAR Row Level Security (RLS)
ALTER TABLE inscricoes ENABLE ROW LEVEL SECURITY;

-- 3. BLOQUEAR TUDO - Sem políticas = Sem acesso
-- Não criamos NENHUMA política para anon
-- Resultado: TODAS as operações são negadas via API REST

-- 4. REVOGAR TODAS as permissões
REVOKE ALL ON inscricoes FROM anon;
REVOKE ALL ON inscricoes FROM public;
REVOKE ALL ON inscricoes FROM authenticated;

-- 5. Remover permissões da VIEW também
DROP VIEW IF EXISTS inscricoes_recentes CASCADE;

-- 6. Recriar VIEW protegida (sem permissões públicas)
CREATE OR REPLACE VIEW inscricoes_recentes 
WITH (security_invoker = true) AS
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
  curso_nome
FROM inscricoes
WHERE data_de_criacao >= (NOW() - INTERVAL '30 days')
ORDER BY data_de_criacao DESC;

-- 7. Bloquear VIEW para todos
REVOKE ALL ON inscricoes_recentes FROM anon;
REVOKE ALL ON inscricoes_recentes FROM public;
REVOKE ALL ON inscricoes_recentes FROM authenticated;

-- 8. Bloquear sequências
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM public;

-- ========================================
-- 🔒 RESULTADO (BLOQUEIO TOTAL):
-- ========================================
-- 
-- VIA API REST (Postman, JavaScript direto):
-- ❌ INSERT → NEGADO (sem política)
-- ❌ SELECT → NEGADO (sem política)
-- ❌ UPDATE → NEGADO (sem política)
-- ❌ DELETE → NEGADO (sem política)
--
-- VIA EDGE FUNCTION (com service_role key):
-- ✅ INSERT → PERMITIDO
-- ✅ Edge Function valida token secreto antes de inserir
--
-- VIA PAINEL SUPABASE:
-- ✅ Você consegue tudo normalmente
--
-- ========================================

-- Verificar políticas (deve retornar VAZIO):
-- SELECT tablename, policyname, roles, cmd 
-- FROM pg_policies 
-- WHERE tablename = 'inscricoes';
-- 
-- Resultado esperado: (sem linhas) = TUDO BLOQUEADO ✅

-- Verificar permissões (deve retornar VAZIO):
-- SELECT grantee, privilege_type 
-- FROM information_schema.table_privileges 
-- WHERE table_name = 'inscricoes' 
-- AND grantee IN ('anon', 'authenticated', 'public');
--
-- Resultado esperado: (sem linhas) = SEM PERMISSÕES ✅

-- ========================================
-- ✅ PRÓXIMO PASSO:
-- Criar Edge Function que:
-- 1. Recebe requisição do site
-- 2. Valida token secreto
-- 3. Usa service_role key para inserir
-- 4. Retorna sucesso/erro
-- ========================================

