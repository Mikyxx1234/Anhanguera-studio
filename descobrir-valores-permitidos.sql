-- Descobrir EXATAMENTE quais valores são permitidos no tipo_de_curso

-- 1. Ver a definição completa do constraint
SELECT 
  conname as constraint_name,
  pg_get_constraintdef(oid) as definition
FROM pg_constraint
WHERE conrelid = 'inscricoes'::regclass
AND conname LIKE '%tipo_de_curso%';

-- 2. Ver todos os constraints
SELECT 
  conname,
  pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conrelid = 'inscricoes'::regclass;

-- 3. Testar valores possíveis um por um:

-- Teste A: graduacao (minúsculo)
INSERT INTO inscricoes (nome_completo, celular, tipo_de_curso, pagina, status)
VALUES ('Teste A', '(11) 99999-9999', 'graduacao', 'graduacao', 'novo') RETURNING *;

-- Se falhar, delete e tente o próximo:
-- DELETE FROM inscricoes WHERE nome_completo LIKE 'Teste%';

-- Teste B: Graduacao (sem acento)
-- INSERT INTO inscricoes (nome_completo, celular, tipo_de_curso, pagina, status)
-- VALUES ('Teste B', '(11) 99999-9999', 'Graduacao', 'graduacao', 'novo') RETURNING *;

-- Teste C: GRADUAÇÃO (maiúsculo)
-- INSERT INTO inscricoes (nome_completo, celular, tipo_de_curso, pagina, status)
-- VALUES ('Teste C', '(11) 99999-9999', 'GRADUAÇÃO', 'graduacao', 'novo') RETURNING *;

-- Teste D: graduação (minúsculo com acento)
-- INSERT INTO inscricoes (nome_completo, celular, tipo_de_curso, pagina, status)
-- VALUES ('Teste D', '(11) 99999-9999', 'graduação', 'graduacao', 'novo') RETURNING *;

-- 4. Ver valores existentes na tabela (se houver)
SELECT DISTINCT tipo_de_curso 
FROM inscricoes 
WHERE tipo_de_curso IS NOT NULL
LIMIT 20;

