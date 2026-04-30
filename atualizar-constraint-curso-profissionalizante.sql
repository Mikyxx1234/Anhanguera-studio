-- ============================================
-- ATUALIZAR CONSTRAINT PARA ACEITAR CURSO PROFISSIONALIZANTE
-- Execute este SQL no DBGate ou Supabase SQL Editor
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

-- 3. CRIAR NOVA CONSTRAINT COM 'curso-profissionalizante'
ALTER TABLE inscricoes
ADD CONSTRAINT inscricoes_tipo_de_curso_check
CHECK (tipo_de_curso = ANY (ARRAY[
  'graduacao'::text, 
  'pos-graduacao'::text, 
  'curso-tecnico'::text,
  'curso-profissionalizante'::text
]));

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
    'Teste Curso Profissionalizante',
    '(11) 98888-8888',
    null,
    'curso-profissionalizante',  -- ✅ Agora deve funcionar!
    'cursos-profissionalizantes',
    'novo',
    'Marketing Digital (Agente)'
);

-- 5. VERIFICAR SE O REGISTRO FOI INSERIDO
SELECT * FROM inscricoes 
WHERE tipo_de_curso = 'curso-profissionalizante' 
ORDER BY data_de_criacao DESC 
LIMIT 1;

-- 6. LIMPAR O TESTE (OPCIONAL)
-- DELETE FROM inscricoes WHERE nome_completo = 'Teste Curso Profissionalizante';

-- ============================================
-- RESULTADO ESPERADO
-- ============================================
-- ✅ Constraint atualizada
-- ✅ Valores permitidos: 'graduacao', 'pos-graduacao', 'curso-tecnico', 'curso-profissionalizante'
-- ✅ INSERT de teste funcionou

