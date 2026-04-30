# 🔒 SEGURANÇA MÁXIMA - BLOQUEIO TOTAL

## 🎯 Objetivo
**NINGUÉM** pode fazer **NADA** via API, exceto o site gravar inscrições.

## ✅ Status Atual
- ✅ Seu código já usa a `anon` key (correto!)
- ✅ O retorno já está em modo `minimal` (não expõe dados no response)
- ❌ **PROBLEMA:** Falta aplicar o script de bloqueio no Supabase

## 🚀 O QUE FAZER AGORA

### 1️⃣ Abra o Supabase
1. Acesse: https://supabase.com
2. Faça login
3. Selecione seu projeto: **tufvduiaybogfhgausqj**

### 2️⃣ Execute o Script de Segurança
1. No menu lateral, clique em **SQL Editor**
2. Clique em **New Query**
3. Abra o arquivo **`security-inscricoes.sql`** (está na raiz do projeto)
4. Copie TODO o conteúdo
5. Cole no SQL Editor do Supabase
6. Clique em **RUN** ou pressione `Ctrl + Enter`

### 3️⃣ Verifique se Funcionou
Execute este comando no SQL Editor:

```sql
SELECT tablename, policyname, roles, cmd 
FROM pg_policies 
WHERE tablename = 'inscricoes';
```

**Deve retornar APENAS 1 linha:**
```
inscricoes | Site pode inserir apenas | {anon} | INSERT
```

**Se retornar mais que 1 política, execute o script novamente!**

## 🧪 Testes no Postman

### ✅ Teste 1: INSERT (deve funcionar - site)
```
POST https://tufvduiaybogfhgausqj.supabase.co/rest/v1/inscricoes
Headers:
  - apikey: sua_anon_key
  - Content-Type: application/json
Body:
{
  "nome_completo": "Teste",
  "celular": "11999999999",
  "tipo_de_curso": "graduacao",
  "pagina": "teste"
}

Resultado esperado: 201 Created ✅
```

### ❌ Teste 2: SELECT (deve falhar - bloqueado)
```
GET https://tufvduiaybogfhgausqj.supabase.co/rest/v1/inscricoes?select=*
Headers:
  - apikey: sua_anon_key

Resultado esperado: [] (vazio) ou erro 403 ✅
```

### ❌ Teste 3: UPDATE (deve falhar - bloqueado)
```
PATCH https://tufvduiaybogfhgausqj.supabase.co/rest/v1/inscricoes?id=eq.xxx
Resultado esperado: erro 403 ✅
```

### ❌ Teste 4: DELETE (deve falhar - bloqueado)
```
DELETE https://tufvduiaybogfhgausqj.supabase.co/rest/v1/inscricoes?id=eq.xxx
Resultado esperado: erro 403 ✅
```

## ✅ Resultado Final (SEGURANÇA MÁXIMA)

| Ação | Via API (Postman/JavaScript) | Painel Supabase |
|------|------------------------------|-----------------|
| **INSERT** | ✅ Apenas site | ✅ Você consegue |
| **SELECT** | ❌ BLOQUEADO | ✅ Você consegue |
| **UPDATE** | ❌ BLOQUEADO | ✅ Você consegue |
| **DELETE** | ❌ BLOQUEADO | ✅ Você consegue |

**Ninguém via API consegue ler, alterar ou deletar dados!** 🔒

## 📋 Checklist de Segurança Máxima

- [ ] Executei o `security-inscricoes.sql` completo no Supabase
- [ ] Verifiquei que existe APENAS 1 política (INSERT para anon)
- [ ] Testei INSERT no Postman (deve funcionar ✅)
- [ ] Testei SELECT no Postman (deve retornar vazio ❌)
- [ ] Testei UPDATE no Postman (deve dar erro 403 ❌)
- [ ] Testei DELETE no Postman (deve dar erro 403 ❌)
- [ ] Testei o formulário do site (deve funcionar ✅)
- [ ] Confirmei que consigo ver dados no painel Supabase ✅

**Todos ✅? NINGUÉM consegue mexer nos seus dados via API!** 🔒🎉

---

## 💡 Dica Extra

Se quiser verificar as permissões da tabela, execute:

```sql
SELECT 
    grantee, 
    table_name, 
    privilege_type 
FROM information_schema.table_privileges 
WHERE table_name = 'inscricoes' 
AND grantee IN ('anon', 'authenticated', 'public');
```

Deve mostrar apenas:
- `anon` → `INSERT`
- `authenticated` → `SELECT`

