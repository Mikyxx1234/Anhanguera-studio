-- Verificar o constraint de tipo_de_curso

-- 1. Ver o constraint exato
SELECT 
  conname as constraint_name,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conrelid = 'inscricoes'::regclass
AND conname LIKE '%tipo_de_curso%';

-- 2. Ver todos os constraints da tabela
SELECT 
  conname as constraint_name,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conrelid = 'inscricoes'::regclass;

-- 3. Valores válidos comuns para tipo_de_curso
-- Provavelmente algo como: 'Graduação', 'Pós-Graduação', 'Técnico', etc.
-- Execute o INSERT abaixo com cada valor até encontrar o correto:

-- Teste 1: Graduação
INSERT INTO inscricoes (
  nome_completo, celular, email,
  tipo_de_curso, pagina, campanha, status
) VALUES (
  'Teste Graduação', '(11) 99999-9999', null,
  'Graduação', 'graduacao', null, 'novo'
) RETURNING *;

-- Se o teste acima falhar, tente:
-- INSERT INTO inscricoes (...) VALUES (..., 'Pós-Graduação', ...);
-- INSERT INTO inscricoes (...) VALUES (..., 'Técnico', ...);
-- INSERT INTO inscricoes (...) VALUES (..., 'MBA', ...);

