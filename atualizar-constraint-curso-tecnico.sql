-- ============================================
-- ATUALIZAR CONSTRAINT PARA ACEITAR CURSO TÉCNICO
-- Execute este SQL no Supabase SQL Editor
-- ============================================

-- 1. VER A CONSTRAINT ATUAL
SELECT 
    conname as nome_constraint,
    pg_get_constraintdef(oid) as definicao
FROM pg_constraint 
WHERE conrelid = 'inscricoes'::regclass 
AND conname LIKE '%tipo_de_curso%';

-- 2. REMOVER A CONSTRAINT ANTIGA
ALTER TABLE inscricoes 
DROP CONSTRAINT IF EXISTS inscricoes_tipo_de_curso_check;

-- 3. CRIAR NOVA CONSTRAINT COM 'curso-tecnico'
ALTER TABLE inscricoes
ADD CONSTRAINT inscricoes_tipo_de_curso_check
CHECK (tipo_de_curso = ANY (ARRAY['graduacao'::text, 'pos-graduacao'::text, 'curso-tecnico'::text]));

-- 4. TESTAR SE FUNCIONOU
-- Este INSERT deve funcionar agora:
INSERT INTO inscricoes (
    nome_completo, 
    celular, 
    email, 
    tipo_de_curso, 
    pagina, 
    status,
    nome_curso
) VALUES (
    'Teste Curso Técnico',
    '(11) 99999-9999',
    null,
    'curso-tecnico',  -- ✅ Agora deve funcionar!
    'cursos-tecnicos',
    'novo',
    'Técnico em Marketing'
);

-- 5. VERIFICAR SE O REGISTRO FOI INSERIDO
SELECT * FROM inscricoes 
WHERE tipo_de_curso = 'curso-tecnico' 
ORDER BY data_de_criacao DESC 
LIMIT 1;

-- 6. LIMPAR O TESTE (OPCIONAL)
-- DELETE FROM inscricoes WHERE nome_completo = 'Teste Curso Técnico';

-- ============================================
-- RESULTADO ESPERADO
-- ============================================
-- ✅ Constraint atualizada
-- ✅ Valores permitidos: 'graduacao', 'pos-graduacao', 'curso-tecnico'
-- ✅ INSERT de teste funcionou

