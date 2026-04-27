# 🔒 COMO APLICAR SEGURANÇA MÁXIMA

## 🎯 OBJETIVO
Garantir que **NINGUÉM** possa fazer **NADA** no Supabase via API, exceto o site gravar inscrições.

---

## 📝 PASSO A PASSO (5 MINUTOS)

### 1️⃣ Abra o arquivo `security-inscricoes.sql`
- O arquivo está na raiz do seu projeto
- Selecione TODO o conteúdo (Ctrl+A)
- Copie (Ctrl+C)

### 2️⃣ Acesse o Supabase
1. Entre em: **https://supabase.com**
2. Faça login
3. Selecione seu projeto: **tufvduiaybogfhgausqj**

### 3️⃣ Abra o SQL Editor
1. No menu lateral esquerdo, clique em **SQL Editor**
2. Clique no botão **New Query**
3. Cole todo o conteúdo do arquivo (Ctrl+V)
4. Clique em **RUN** (ou pressione Ctrl+Enter)

### 4️⃣ Aguarde a Execução
- Deve aparecer "Success. No rows returned"
- Isso é NORMAL! Significa que aplicou corretamente ✅

### 5️⃣ Verifique se Aplicou
Cole e execute este comando:

```sql
SELECT tablename, policyname, roles, cmd 
FROM pg_policies 
WHERE tablename = 'inscricoes';
```

**Resultado correto:**
```
inscricoes | Site pode inserir apenas | {anon} | INSERT
```

✅ **Se apareceu isso, está PERFEITO!**

❌ **Se apareceu mais de 1 linha, execute o script novamente**

---

## 🧪 TESTE DE SEGURANÇA

### Teste no Postman ou Navegador

**Tente ler os dados:**
```
GET https://tufvduiaybogfhgausqj.supabase.co/rest/v1/inscricoes?select=*

Headers:
apikey: sua_anon_key
```

**Resultado esperado:**
```json
[]
```
Ou erro 403.

✅ **Se retornar vazio = SEGURO!**

❌ **Se retornar dados = Problema! Execute o script novamente**

---

## ✅ O QUE FOI BLOQUEADO

| Ação | Antes | Depois |
|------|-------|--------|
| **Ler dados via API** | ✅ Qualquer um podia | ❌ BLOQUEADO |
| **Atualizar via API** | ✅ Qualquer um podia | ❌ BLOQUEADO |
| **Deletar via API** | ✅ Qualquer um podia | ❌ BLOQUEADO |
| **Inserir (site)** | ✅ Funcionava | ✅ Continua funcionando |
| **Ver no painel Supabase** | ✅ Você via | ✅ Você continua vendo |

---

## 🎉 RESULTADO FINAL

✅ **Seu site continua gravando normalmente**

✅ **Você vê tudo no painel do Supabase**

❌ **Ninguém via Postman/API consegue ler dados**

❌ **Ninguém consegue alterar ou deletar via API**

🔒 **DADOS 100% PROTEGIDOS!**

---

## ⚠️ IMPORTANTE

- O formulário do site **continuará funcionando** normalmente
- Você **consegue ver dados** quando logado no Supabase
- Apenas **bloqueamos acesso via API pública**
- **Nenhum código** do site precisa ser alterado

---

## 🆘 PROBLEMAS?

### "O formulário parou de funcionar"
❌ Isso **NÃO deve acontecer**. Se aconteceu:
1. Verifique se executou o script completo
2. Verifique se a política INSERT existe
3. Teste manualmente no Postman (POST deve funcionar)

### "Não consigo ver dados no Supabase"
✅ Isso é normal se não estiver logado
- Faça login no painel do Supabase
- Vá em Table Editor > inscricoes
- Deve conseguir ver tudo

### "Postman ainda consegue ler"
❌ Execute o script novamente
- Verifique que está usando `anon` key
- **NÃO** use `service_role` key nos testes

---

## 📞 DÚVIDAS?

1. Leia: `SEGURANCA_SUPABASE.md` (documentação completa)
2. Leia: `APLICAR_SEGURANCA.md` (detalhes técnicos)
3. Consulte: https://supabase.com/docs/guides/auth/row-level-security

**Boa sorte!** 🚀🔒



