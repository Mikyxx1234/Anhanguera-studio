-- ========================================
-- SCRIPT DE SEGURANÇA MÁXIMA - TABELA INSCRIÇÕES
-- ========================================
-- 🔒 BLOQUEIO TOTAL: Apenas o site pode inserir dados
-- ❌ Ninguém pode ler, atualizar ou deletar via API
-- ✅ Você pode ver dados apenas no painel do Supabase (autenticado no dashboard)

-- 1. Remover TODAS as políticas existentes
DROP POLICY IF EXISTS "Permitir inserção pública de inscrições" ON inscricoes;
DROP POLICY IF EXISTS "Permitir leitura de inscrições para admin" ON inscricoes;
DROP POLICY IF EXISTS "Enable insert for anon users" ON inscricoes;
DROP POLICY IF EXISTS "Enable read access for all users" ON inscricoes;
DROP POLICY IF EXISTS "Public insert access" ON inscricoes;
DROP POLICY IF EXISTS "Permitir apenas inserção pública" ON inscricoes;
DROP POLICY IF EXISTS "Permitir leitura apenas para admin autenticado" ON inscricoes;

-- 2. ATIVAR Row Level Security (RLS)
ALTER TABLE inscricoes ENABLE ROW LEVEL SECURITY;

-- 3. ÚNICA POLÍTICA: Apenas INSERT para anon (site)
CREATE POLICY "Site pode inserir apenas"
ON inscricoes
FOR INSERT
TO anon
WITH CHECK (true);

-- 4. REVOGAR TODAS as permissões públicas
REVOKE ALL ON inscricoes FROM anon;
REVOKE ALL ON inscricoes FROM public;
REVOKE ALL ON inscricoes FROM authenticated;

-- 5. Conceder APENAS INSERT para anon (site)
GRANT INSERT ON inscricoes TO anon;

-- 6. BLOQUEAR a VIEW também
DROP VIEW IF EXISTS inscricoes_recentes CASCADE;

-- 7. Recriar VIEW sem permissões públicas
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

-- 8. Revogar tudo da VIEW
REVOKE ALL ON inscricoes_recentes FROM anon;
REVOKE ALL ON inscricoes_recentes FROM public;
REVOKE ALL ON inscricoes_recentes FROM authenticated;

-- 9. BLOQUEAR funções de sequência/id (evita enumeração)
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM public;

-- ========================================
-- 🔒 RESULTADO ESPERADO (MÁXIMA SEGURANÇA):
-- ========================================
-- 
-- VIA API (Postman, JavaScript, qualquer cliente HTTP):
-- ❌ SELECT → NEGADO (nem anon, nem authenticated)
-- ❌ UPDATE → NEGADO (sem política)
-- ❌ DELETE → NEGADO (sem política)
-- ✅ INSERT → PERMITIDO apenas para anon (site)
--
-- VIA PAINEL DO SUPABASE (você logado no dashboard):
-- ✅ Você consegue ver, editar e deletar normalmente
--    (RLS não se aplica ao painel administrativo)
--
-- ========================================
-- 🛡️ PROTEÇÃO TOTAL GARANTIDA!
-- ========================================

-- ========================================
-- 📋 VERIFICAÇÕES (execute para conferir)
-- ========================================

-- Ver políticas ativas (deve ter apenas 1):
-- SELECT tablename, policyname, roles, cmd 
-- FROM pg_policies 
-- WHERE tablename = 'inscricoes';
-- 
-- Resultado esperado:
-- inscricoes | Site pode inserir apenas | {anon} | INSERT

-- Ver permissões da tabela:
-- SELECT grantee, privilege_type 
-- FROM information_schema.table_privileges 
-- WHERE table_name = 'inscricoes' 
-- AND grantee IN ('anon', 'authenticated', 'public');
--
-- Resultado esperado:
-- anon | INSERT

-- ========================================
-- 🧪 TESTES
-- ========================================

-- Teste no Postman (com anon key):
-- 
-- ✅ INSERT (deve funcionar):
-- POST /inscricoes
-- Body: { "nome_completo": "Teste", "celular": "11999999999", ... }
-- Resultado: 201 Created
--
-- ❌ SELECT (deve falhar):
-- GET /inscricoes?select=*
-- Resultado: 401 ou 403 ou [] (vazio)
--
-- ❌ UPDATE (deve falhar):
-- PATCH /inscricoes?id=eq.xxx
-- Resultado: 401 ou 403
--
-- ❌ DELETE (deve falhar):
-- DELETE /inscricoes?id=eq.xxx
-- Resultado: 401 ou 403

-- ========================================
-- ✅ APLICADO COM SUCESSO!
-- ========================================

