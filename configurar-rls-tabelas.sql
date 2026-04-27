-- ============================================
-- CONFIGURAR PERMISSÕES (RLS) DAS TABELAS
-- Execute este SQL no Supabase SQL Editor
-- ============================================

-- 1. VERIFICAR SE AS TABELAS EXISTEM
SELECT 
    tablename,
    CASE 
        WHEN rowsecurity THEN '🔒 RLS Habilitado'
        ELSE '🔓 RLS Desabilitado'
    END as status_rls
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('cursos_grad_anhanguera', 'cursos_pos_anhanguera', 'inscricoes');

-- 2. VER POLICIES EXISTENTES
SELECT 
    tablename,
    policyname,
    cmd as comando,
    qual as condicao
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('cursos_grad_anhanguera', 'cursos_pos_anhanguera', 'inscricoes');

-- ============================================
-- SOLUÇÃO 1: HABILITAR RLS E CRIAR POLICIES
-- ============================================

-- Para cursos_grad_anhanguera
ALTER TABLE cursos_grad_anhanguera ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir leitura pública cursos graduação" ON cursos_grad_anhanguera;
CREATE POLICY "Permitir leitura pública cursos graduação"
ON cursos_grad_anhanguera
FOR SELECT
TO public
USING (true);

-- Para cursos_pos_anhanguera
ALTER TABLE cursos_pos_anhanguera ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir leitura pública cursos pós" ON cursos_pos_anhanguera;
CREATE POLICY "Permitir leitura pública cursos pós"
ON cursos_pos_anhanguera
FOR SELECT
TO public
USING (true);

-- Para inscricoes (já deve ter, mas vamos garantir)
ALTER TABLE inscricoes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir inserção pública de inscrições" ON inscricoes;
CREATE POLICY "Permitir inserção pública de inscrições"
ON inscricoes
FOR INSERT
TO public
WITH CHECK (true);

-- ============================================
-- SOLUÇÃO 2 (ALTERNATIVA): DESABILITAR RLS
-- Use esta opção se a Solução 1 não funcionar
-- ============================================

-- DESCOMENTE AS LINHAS ABAIXO SE QUISER DESABILITAR RLS

-- ALTER TABLE cursos_grad_anhanguera DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE cursos_pos_anhanguera DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE inscricoes DISABLE ROW LEVEL SECURITY;

-- ============================================
-- 3. VERIFICAR SE FUNCIONOU
-- ============================================

-- Testar leitura de cursos de graduação
SELECT COUNT(*) as total_cursos_graduacao FROM cursos_grad_anhanguera;

-- Testar leitura de cursos de pós
SELECT COUNT(*) as total_cursos_pos FROM cursos_pos_anhanguera;

-- Ver alguns cursos de graduação
SELECT id, nome, area, tipo, modalidade, preco 
FROM cursos_grad_anhanguera 
LIMIT 5;

-- Ver alguns cursos de pós
SELECT id, nome_curso, area, 
       "NORMAL - 10 meses - 18 parcelas" as preco_normal,
       "INTENSIVO - 6 meses - 18 parcelas" as preco_intensivo
FROM cursos_pos_anhanguera 
LIMIT 5;

-- ============================================
-- RESULTADO ESPERADO
-- ============================================
-- Se funcionou, você verá:
-- ✅ Contagem de cursos maior que 0
-- ✅ Lista de cursos
-- 
-- Se não funcionou:
-- ❌ Erro de permissão
-- ❌ 0 cursos encontrados

