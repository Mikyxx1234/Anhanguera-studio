# 🔍 Guia de Debug - Sistema de Inscrições

## ⚠️ Problema: Inscrições não estão sendo salvas

### 📋 Checklist de Verificação

Execute os seguintes passos no Supabase SQL Editor:

#### 1. Execute o script de correção
Execute o arquivo `corrigir-inscricoes.sql` completo no SQL Editor.

#### 2. Verifique se a tabela tem todas as colunas
```sql
SELECT column_name, data_type 
FROM information_schema.columns
WHERE table_name = 'inscricoes'
ORDER BY ordinal_position;
```

**Deve ter estas colunas:**
- id (uuid)
- nome_completo (text)
- celular (text)
- email (text)
- tipo_de_curso (text)
- pagina (text)
- campanha (text)
- status (text)
- data_de_criacao (timestamp)
- curso_nome (text) ⬅️ IMPORTANTE
- modalidade (text) ⬅️ IMPORTANTE
- updated_at (timestamp)

#### 3. Verifique as políticas RLS
```sql
SELECT policyname, cmd, roles 
FROM pg_policies 
WHERE tablename = 'inscricoes';
```

**Deve mostrar:**
- Política: "Permitir inserção pública de inscrições"
- Comando: INSERT
- Roles: anon, authenticated

#### 4. Teste inserção manual
```sql
INSERT INTO inscricoes (
  nome_completo, celular, tipo_de_curso, 
  pagina, status, curso_nome, modalidade
) VALUES (
  'Teste Manual', '(11) 99999-9999', 'Graduação',
  '/test', 'novo', 'Teste Curso', 'EAD'
) RETURNING *;
```

Se este INSERT funcionar, o problema está no código frontend.
Se der erro, o problema está na configuração do banco.

---

## 🧪 Teste no Navegador

### 1. Abra o console do navegador (F12)
- Windows/Linux: F12 ou Ctrl+Shift+I
- Mac: Cmd+Option+I

### 2. Acesse a página
```
http://localhost:5174/graduation
```

### 3. Clique em "Ver preço" e preencha o formulário

### 4. Observe os logs no console

**Logs esperados (em ordem):**

```
🚀 Iniciando salvamento de lead...
📝 Dados do lead preparados: {nome_completo: "...", celular: "...", ...}
📤 Tentando salvar inscrição: {...}
📋 Dados formatados para inserção: {...}
✅ Inscrição salva com sucesso!
📊 Dados salvos: [{id: "...", nome_completo: "...", ...}]
✅ Lead salvo com sucesso no banco!
```

**Se houver erro:**

```
❌ Erro ao salvar inscrição: {message: "...", code: "..."}
Detalhes do erro: {...}
```

---

## 🔧 Soluções Comuns

### Erro: "relation inscricoes does not exist"
**Causa:** Tabela não existe
**Solução:** Execute `inscricoes-schema.sql`

### Erro: "column curso_nome does not exist"
**Causa:** Colunas faltando
**Solução:** Execute `corrigir-inscricoes.sql`

### Erro: "new row violates row-level security policy"
**Causa:** Política RLS bloqueando inserção
**Solução:**
```sql
DROP POLICY IF EXISTS "Permitir inserção pública de inscrições" ON inscricoes;

CREATE POLICY "Permitir inserção pública de inscrições" ON inscricoes
    FOR INSERT 
    TO anon, authenticated
    WITH CHECK (true);
```

### Erro: "permission denied for table inscricoes"
**Causa:** Permissões do Supabase
**Solução:**
```sql
GRANT INSERT ON inscricoes TO anon;
GRANT SELECT ON inscricoes TO authenticated;
```

### Sem erros mas não salva
**Causa:** Pode estar salvando mas você não está vendo
**Solução:** Verifique se realmente não salvou:
```sql
SELECT * FROM inscricoes 
WHERE data_de_criacao > NOW() - INTERVAL '1 hour'
ORDER BY data_de_criacao DESC;
```

---

## 📊 Verificar se Salvou

### No Supabase
1. Table Editor → inscricoes
2. Ordene por "data_de_criacao" (decrescente)
3. Verifique os últimos registros

### Via SQL
```sql
-- Últimas 10 inscrições
SELECT 
  id,
  nome_completo,
  celular,
  curso_nome,
  modalidade,
  data_de_criacao
FROM inscricoes 
ORDER BY data_de_criacao DESC 
LIMIT 10;

-- Inscrições de hoje
SELECT COUNT(*) as total_hoje
FROM inscricoes 
WHERE DATE(data_de_criacao) = CURRENT_DATE;
```

---

## 🔍 Debug Avançado

### Verificar conexão Supabase
No console do navegador:
```javascript
// Cole isso no console
console.log('URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Key:', import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 20) + '...');
```

### Testar inserção direto no console
```javascript
// Cole isso no console do navegador (depois de abrir a página)
const { createClient } = await import('@supabase/supabase-js');
const supabase = createClient(
  'https://tufvduiaybogfhgausqj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1ZnZkdWlheWJvZ2ZoZ2F1c3FqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwOTUyNjksImV4cCI6MjA3MjY3MTI2OX0.o-rO2rm5uYtI-NDp5amFm9gkXcToJWjuHDJFkaOtYtQ'
);

const { data, error } = await supabase
  .from('inscricoes')
  .insert([{
    nome_completo: 'Teste Console',
    celular: '(11) 99999-9999',
    tipo_de_curso: 'Teste',
    pagina: '/test',
    status: 'novo',
    curso_nome: 'Teste',
    modalidade: 'EAD'
  }])
  .select();

console.log('Resultado:', { data, error });
```

---

## ✅ Checklist Final

- [ ] Executei `corrigir-inscricoes.sql` no Supabase
- [ ] Verifiquei que a tabela tem todas as colunas
- [ ] Testei inserção manual com sucesso
- [ ] Verifiquei as políticas RLS
- [ ] Abri o console do navegador (F12)
- [ ] Testei preencher o formulário
- [ ] Vi os logs no console
- [ ] Verifiquei a tabela no Supabase

---

## 📞 Próximo Passo

**Se depois de executar o `corrigir-inscricoes.sql` ainda não funcionar:**

1. Copie e cole aqui a mensagem de erro completa do console
2. Execute este SQL e cole o resultado:
```sql
SELECT column_name FROM information_schema.columns
WHERE table_name = 'inscricoes';
```
3. Verifique se o teste manual funcionou

