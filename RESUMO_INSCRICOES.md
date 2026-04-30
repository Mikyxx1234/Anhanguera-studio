# ✅ Sistema de Inscrições - SIMPLIFICADO

## 📋 Dados Salvos

Quando o usuário clica em "Ver preço" e preenche o formulário, o sistema salva:

```javascript
{
  nome_completo: "Nome da pessoa",
  celular: "(11) 99999-9999",
  email: null,
  tipo_de_curso: "Administração", // Nome do curso que clicou
  pagina: "graduacao",
  campanha: null, // ou UTM se houver
  status: "novo"
}
```

**Campos da tabela `inscricoes`:**
- ✅ `nome_completo` - Nome preenchido
- ✅ `celular` - Telefone preenchido
- ✅ `email` - null (não solicitamos)
- ✅ `tipo_de_curso` - Nome do curso (ex: "Administração")
- ✅ `pagina` - "graduacao" (fixo)
- ✅ `campanha` - UTM campaign se houver na URL
- ✅ `status` - "novo" (fixo)
- ✅ `data_de_criacao` - Automático pelo banco

## 🔧 Como Testar

### 1. Execute no SQL Editor do Supabase:

```sql
-- Teste de inserção manual
INSERT INTO inscricoes (
  nome_completo,
  celular,
  email,
  tipo_de_curso,
  pagina,
  campanha,
  status
) VALUES (
  'Teste Manual',
  '(11) 99999-9999',
  null,
  'Administração',
  'graduacao',
  null,
  'novo'
) RETURNING *;
```

Se funcionar ✅ → O banco está OK
Se der erro ❌ → Execute o script abaixo

### 2. Se der erro, configure as políticas RLS:

```sql
ALTER TABLE inscricoes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir inserção pública de inscrições" ON inscricoes;

CREATE POLICY "Permitir inserção pública de inscrições" ON inscricoes
    FOR INSERT 
    TO anon, authenticated
    WITH CHECK (true);
```

### 3. Teste no site:

1. Abra: `http://localhost:5174/graduation`
2. Abra o Console (F12)
3. Clique em "Ver preço" em qualquer curso
4. Preencha:
   - Nome: "Teste"
   - Telefone: "(11) 99999-9999"
5. Clique "Enviar"

### 4. Veja os logs no console:

**Sucesso:**
```
🚀 Iniciando salvamento de lead...
📝 Dados do lead preparados: {nome_completo: "Teste", celular: "(11) 99999-9999", tipo_de_curso: "Administração", pagina: "graduacao", ...}
📤 Tentando salvar inscrição: {...}
📋 Dados formatados para inserção: {...}
✅ Inscrição salva com sucesso!
📊 Dados salvos: [{...}]
✅ Lead salvo com sucesso no banco!
```

**Erro:**
```
❌ Erro ao salvar inscrição: {...}
Detalhes do erro: {...}
```

### 5. Verifique no Supabase:

```sql
SELECT * FROM inscricoes 
ORDER BY data_de_criacao DESC 
LIMIT 10;
```

ou

```sql
SELECT * FROM inscricoes_recentes;
```

## 📊 Ver Inscrições

### Últimas inscrições:
```sql
SELECT 
  nome_completo,
  celular,
  tipo_de_curso,
  pagina,
  data_de_criacao
FROM inscricoes 
ORDER BY data_de_criacao DESC 
LIMIT 20;
```

### Inscrições de hoje:
```sql
SELECT * FROM inscricoes 
WHERE DATE(data_de_criacao) = CURRENT_DATE
ORDER BY data_de_criacao DESC;
```

### Cursos mais procurados:
```sql
SELECT 
  tipo_de_curso as curso,
  COUNT(*) as total
FROM inscricoes
GROUP BY tipo_de_curso
ORDER BY total DESC;
```

## 🎯 Checklist

- [ ] Executei o teste manual de inserção no SQL Editor
- [ ] Teste manual funcionou
- [ ] Configurei as políticas RLS
- [ ] Abri o console do navegador (F12)
- [ ] Testei preencher o formulário no site
- [ ] Vi "✅ Inscrição salva com sucesso!" no console
- [ ] Verifiquei no Supabase Table Editor
- [ ] Inscrição apareceu na tabela

## ⚠️ Se Não Funcionar

**Copie e cole aqui:**
1. A mensagem de erro completa do console (se houver)
2. O resultado deste SQL:
```sql
SELECT column_name FROM information_schema.columns
WHERE table_name = 'inscricoes';
```

## 📝 Arquivos para Teste

- `teste-inscricao-simples.sql` - Execute este no Supabase

**Tudo simplificado! Apenas os campos essenciais.** 🎯

