-- Teste com valores comuns de tipo_de_curso

-- Primeiro, veja o constraint:
SELECT pg_get_constraintdef(oid) 
FROM pg_constraint
WHERE conrelid = 'inscricoes'::regclass
AND conname LIKE '%tipo_de_curso%';

-- Delete testes anteriores
DELETE FROM inscricoes WHERE nome_completo LIKE 'Teste%';

-- Agora tente estes valores (um por vez, veja qual funciona):

-- 1. Tentativa: graduação (minúsculo)
INSERT INTO inscricoes (nome_completo, celular, email, tipo_de_curso, pagina, status)
VALUES ('Teste 1', '(11) 99999-9999', null, 'graduação', 'graduacao', 'novo');

-- Se falhou, tente:
-- 2. Tentativa: graduacao (sem acento)
-- INSERT INTO inscricoes (nome_completo, celular, email, tipo_de_curso, pagina, status)
-- VALUES ('Teste 2', '(11) 99999-9999', null, 'graduacao', 'graduacao', 'novo');

-- 3. Tentativa: Graduação (primeira maiúscula)
-- INSERT INTO inscricoes (nome_completo, celular, email, tipo_de_curso, pagina, status)
-- VALUES ('Teste 3', '(11) 99999-9999', null, 'Graduação', 'graduacao', 'novo');

-- 4. Ver se já existem registros (copie um valor que funciona)
SELECT DISTINCT tipo_de_curso FROM inscricoes WHERE tipo_de_curso IS NOT NULL;

