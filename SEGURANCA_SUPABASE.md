# 🔒 Configuração de Segurança - Supabase

## ⚠️ PROBLEMA IDENTIFICADO

A tabela `inscricoes` estava **completamente exposta**, permitindo que qualquer pessoa com a URL da API conseguisse:
- ❌ Ler TODOS os dados dos leads (nomes, telefones, emails)
- ❌ Ver informações sensíveis via Postman ou qualquer cliente HTTP

## ✅ SOLUÇÃO IMPLEMENTADA

Criamos políticas RLS (Row Level Security) que:
- ✅ Permitem apenas **INSERT** para usuários anônimos (formulário do site funciona)
- ✅ **BLOQUEIAM SELECT** para API pública (Postman não consegue mais ler)
- ✅ Permitem **SELECT apenas para usuários autenticados** (você no painel Supabase)
- ✅ Bloqueiam **UPDATE e DELETE** para todos

---

## 📋 PASSO A PASSO PARA APLICAR

### 1️⃣ Acesse o Supabase
1. Entre em: https://supabase.com
2. Faça login na sua conta
3. Selecione seu projeto

### 2️⃣ Execute o Script de Segurança
1. No painel lateral, clique em **"SQL Editor"**
2. Clique em **"New query"**
3. Abra o arquivo `security-inscricoes.sql` deste projeto
4. **Copie TODO o conteúdo** do arquivo
5. **Cole no SQL Editor** do Supabase
6. Clique em **"Run"** (ou pressione Ctrl+Enter)

### 3️⃣ Verifique se Foi Aplicado
Execute este comando no SQL Editor para ver as políticas:

```sql
SELECT schemaname, tablename, policyname, roles, cmd 
FROM pg_policies 
WHERE tablename = 'inscricoes';
```

**Resultado esperado:**
```
| policyname                              | roles              | cmd    |
|-----------------------------------------|--------------------|--------|
| Permitir apenas inserção pública        | anon, authenticated| INSERT |
| Permitir leitura apenas para admin auth | authenticated      | SELECT |
```

---

## 🧪 TESTES DE SEGURANÇA

### ✅ Teste 1: Formulário do Site Deve Funcionar
1. Acesse seu site
2. Preencha o formulário "Inscreva-se" ou "Ver preço"
3. **Deve funcionar normalmente** ✅

### ❌ Teste 2: Postman NÃO Deve Conseguir Ler
Tente fazer um GET no Postman:

**Configuração:**
```
Method: GET
URL: https://[SEU_PROJETO].supabase.co/rest/v1/inscricoes?select=*
Headers:
  - apikey: [SUA_ANON_KEY]
  - Authorization: Bearer [SUA_ANON_KEY]
```

**Resultado esperado:**
```json
[]
```
Ou erro de permissão. **NÃO deve retornar dados!** ✅

### ✅ Teste 3: Você Logado no Supabase Consegue Ver
1. No painel Supabase, vá em **"Table Editor"**
2. Clique na tabela **"inscricoes"**
3. **Deve ver todos os dados** (porque você está autenticado) ✅

---

## 🔑 IMPORTANTE: Tipos de API Keys

O Supabase tem 2 tipos de chaves:

### 1. `anon` key (Pública) - Usa no Frontend
- ✅ Pode ser exposta no código do site
- ✅ Permite apenas INSERT na tabela inscricoes
- ❌ NÃO consegue fazer SELECT/UPDATE/DELETE
- **Esta é a chave que você deve usar no arquivo `.env`**

### 2. `service_role` key (Secreta) - NUNCA use no Frontend
- ⚠️ **BYPASSA TODAS AS POLÍTICAS RLS**
- ⚠️ Tem acesso total ao banco
- ⚠️ **NUNCA exponha esta chave no código**
- ✅ Use apenas em backend/servidor

---

## 🛡️ Verificação Final

Confirme que seu arquivo `.env` está usando a `anon` key:

```env
VITE_SUPABASE_URL=https://[SEU_PROJETO].supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...  # Esta chave é PÚBLICA e segura
```

**Como encontrar suas chaves:**
1. No Supabase, vá em **"Settings"** > **"API"**
2. Use a chave em **"Project API keys"** > **"anon public"**
3. **NÃO use** a chave "service_role"!

---

## 📊 O Que Mudou

### ❌ ANTES (INSEGURO)
```
Qualquer pessoa com a URL:
├─ ✅ Podia inserir leads (OK)
├─ ❌ Podia ler TODOS os leads (PROBLEMA!)
├─ ❌ Via informações sensíveis (PROBLEMA!)
└─ ❌ Expunha dados no Postman (PROBLEMA!)
```

### ✅ DEPOIS (SEGURO)
```
Com a anon key:
├─ ✅ Pode inserir leads (formulário funciona)
├─ 🔒 NÃO pode ler leads (protegido)
├─ 🔒 NÃO vê SELECT no response (minimal)
└─ 🔒 Postman retorna vazio (protegido)

Você autenticado no Supabase:
└─ ✅ Vê todos os dados no painel
```

---

## 🆘 Resolução de Problemas

### "Erro ao salvar inscrição no formulário"
- Verifique se executou o script `security-inscricoes.sql`
- Confirme que a política de INSERT existe
- Verifique se está usando a `anon` key no `.env`

### "Postman ainda consegue ler dados"
- Você pode estar usando a `service_role` key
- Troque para a `anon` key
- Execute novamente o script de segurança

### "Não consigo ver dados no painel Supabase"
- Normal se não estiver logado
- Faça login no Supabase para ver os dados
- A política permite SELECT apenas para authenticated

---

## ✅ Checklist de Segurança

Execute este checklist para garantir que está tudo protegido:

- [ ] Executei o script `security-inscricoes.sql` no SQL Editor
- [ ] Verifiquei que as 2 políticas foram criadas
- [ ] Testei o formulário do site (deve funcionar)
- [ ] Testei Postman com anon key (NÃO deve retornar dados)
- [ ] Confirmei que estou usando `anon` key no `.env`
- [ ] Confirmei que `service_role` key não está no código
- [ ] Testei que consigo ver dados logado no Supabase

**Todos ✅? Sua aplicação está segura!** 🎉

---

## 📝 Notas Adicionais

- As políticas RLS são aplicadas **automaticamente** pela API
- Mesmo que alguém descubra sua URL e anon key, não consegue ler dados
- O Supabase valida todas as requisições contra as políticas RLS
- Dados sensíveis estão **completamente protegidos**

**Dúvidas?** Consulte: https://supabase.com/docs/guides/auth/row-level-security

