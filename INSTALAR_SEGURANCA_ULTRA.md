# 🔒 INSTALAÇÃO - SEGURANÇA ULTRA MÁXIMA

## 🎯 O QUE ESSA SOLUÇÃO FAZ

**ANTES:**
- ✅ Site insere dados via API REST
- ❌ Qualquer pessoa com Postman pode inserir também
- ❌ Anon key está exposta no código

**DEPOIS:**
- ✅ Site insere via Edge Function protegida com token secreto
- ❌ Postman não consegue mais inserir (sem token)
- ❌ API REST completamente bloqueada
- 🔒 Apenas quem tem o token secreto consegue inserir

---

## 📋 PASSO A PASSO (15 MINUTOS)

### ✅ PARTE 1: Bloquear a API REST

#### 1. Execute o SQL no Supabase

1. Acesse https://supabase.com
2. Faça login no seu projeto
3. Vá em **SQL Editor**
4. Clique em **New Query**
5. Abra o arquivo **`security-inscricoes-ULTRA-SEGURA.sql`**
6. Copie TODO o conteúdo e cole no SQL Editor
7. Clique em **RUN**

#### 2. Verifique que TUDO foi bloqueado

Execute no SQL Editor:
```sql
SELECT tablename, policyname, roles, cmd 
FROM pg_policies 
WHERE tablename = 'inscricoes';
```

**Resultado esperado:** (vazio - nenhuma linha)

Isso significa que **TODA a API REST está bloqueada!** ✅

---

### ✅ PARTE 2: Instalar Supabase CLI

#### Windows:
```powershell
npm install -g supabase
```

Ou com Chocolatey:
```powershell
choco install supabase
```

#### Verificar instalação:
```bash
supabase --version
```

---

### ✅ PARTE 3: Fazer Login e Conectar ao Projeto

#### 1. Login no Supabase CLI
```bash
supabase login
```

Vai abrir o navegador para você fazer login.

#### 2. Link ao seu projeto
```bash
supabase link --project-ref tufvduiaybogfhgausqj
```

Quando pedir a senha do banco de dados, use a senha que você definiu ao criar o projeto.

---

### ✅ PARTE 4: Gerar e Configurar Token Secreto

#### 1. Gerar token aleatório

**Windows (PowerShell):**
```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 64 | ForEach-Object {[char]$_})
```

**Ou use este pronto:**
```
7a8f9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a
```

#### 2. Configurar secret no Supabase
```bash
supabase secrets set INSCRICAO_SECRET_TOKEN=7a8f9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a
```

---

### ✅ PARTE 5: Deploy da Edge Function

#### 1. Fazer deploy
```bash
supabase functions deploy salvar-inscricao
```

#### 2. Verificar logs (opcional)
```bash
supabase functions logs salvar-inscricao
```

---

### ✅ PARTE 6: Testar a Segurança

#### Teste 1: API REST deve estar BLOQUEADA

Tente no Postman:
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
```

**Resultado esperado:** Erro 403 ou sem resposta ❌ BLOQUEADO!

#### Teste 2: Edge Function SEM token deve falhar

```
POST https://tufvduiaybogfhgausqj.supabase.co/functions/v1/salvar-inscricao
Headers:
  - Content-Type: application/json
Body:
{
  "nome_completo": "Teste",
  "celular": "11999999999",
  "tipo_de_curso": "graduacao",
  "pagina": "teste"
}
```

**Resultado esperado:** 401 Unauthorized ❌

#### Teste 3: Edge Function COM token deve funcionar

```
POST https://tufvduiaybogfhgausqj.supabase.co/functions/v1/salvar-inscricao
Headers:
  - Content-Type: application/json
  - X-Secret-Token: 7a8f9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a
Body:
{
  "nome_completo": "Teste",
  "celular": "11999999999",
  "tipo_de_curso": "graduacao",
  "pagina": "teste"
}
```

**Resultado esperado:** 201 Created + `{"success":true}` ✅

#### Teste 4: Site deve funcionar normalmente

1. Abra seu site
2. Preencha o formulário
3. Deve gravar normalmente ✅

---

## 🔒 RESULTADO FINAL

| Ação | API REST Direta | Edge Function sem Token | Edge Function com Token | Site |
|------|-----------------|-------------------------|-------------------------|------|
| INSERT | ❌ Bloqueado | ❌ Negado (401) | ✅ Funciona | ✅ Funciona |
| SELECT | ❌ Bloqueado | N/A | N/A | ❌ Bloqueado |
| UPDATE | ❌ Bloqueado | N/A | N/A | ❌ Bloqueado |
| DELETE | ❌ Bloqueado | N/A | N/A | ❌ Bloqueado |

---

## 📁 Arquivos Criados

```
seu-projeto/
├── supabase/
│   └── functions/
│       └── salvar-inscricao/
│           ├── index.ts         ← Edge Function
│           └── README.md        ← Documentação
├── src/
│   └── services/
│       └── inscricaoService.ts  ← Atualizado para usar Edge Function
├── security-inscricoes-ULTRA-SEGURA.sql  ← Execute no Supabase
└── INSTALAR_SEGURANCA_ULTRA.md           ← Este arquivo
```

---

## 🔐 Como Funciona

```
┌─────────────┐
│   USUÁRIO   │
└──────┬──────┘
       │
       │ Preenche formulário
       │
       ▼
┌─────────────────────┐
│   SEU SITE (JS)     │
│                     │
│ Envia dados +       │
│ Token secreto       │
└──────┬──────────────┘
       │
       │ POST com X-Secret-Token: xxx
       │
       ▼
┌─────────────────────────┐
│  EDGE FUNCTION          │
│  (Supabase)             │
│                         │
│  1. Valida token        │
│  2. Se OK, insere dados │
│  3. Retorna sucesso     │
└──────┬──────────────────┘
       │
       │ Usa service_role key
       │ (bypassa RLS)
       │
       ▼
┌─────────────────────────┐
│  BANCO DE DADOS         │
│  (Supabase)             │
│                         │
│  ✅ Dados salvos        │
│  🔒 API REST bloqueada  │
└─────────────────────────┘
```

---

## ✅ Checklist Final

- [ ] Executei `security-inscricoes-ULTRA-SEGURA.sql` no Supabase
- [ ] Verifiquei que não há políticas RLS (consulta retornou vazio)
- [ ] Instalei Supabase CLI
- [ ] Fiz login com `supabase login`
- [ ] Linkei ao projeto com `supabase link`
- [ ] Configurei o secret token
- [ ] Fiz deploy da Edge Function
- [ ] Testei API REST (deve estar bloqueada ❌)
- [ ] Testei Edge Function sem token (deve falhar ❌)
- [ ] Testei Edge Function com token (deve funcionar ✅)
- [ ] Testei o formulário do site (deve funcionar ✅)

**Todos ✅? Parabéns! Seu banco está ultra protegido!** 🔒🎉

---

## 🆘 Problemas Comuns

### "supabase: command not found"
- Reinstale o Supabase CLI
- Reinicie o terminal

### "Invalid project ref"
- Verifique se usou o ID correto: `tufvduiaybogfhgausqj`

### "Edge Function retorna 401"
- Verifique se configurou o secret corretamente
- Confirme que está enviando o header `X-Secret-Token`

### "Site não grava mais"
- Verifique se fez deploy da Edge Function
- Veja os logs: `supabase functions logs salvar-inscricao`
- Confirme que o token no código é o mesmo do Supabase

---

## 💡 Próximos Passos (Opcional)

1. **Em produção, use variável de ambiente:**
   - Adicione `VITE_INSCRICAO_SECRET_TOKEN` no seu `.env`
   - Nunca commite o token no Git

2. **Restrinja CORS:**
   - Na Edge Function, troque `'*'` pelo seu domínio

3. **Add rate limiting:**
   - Limite requisições por IP na Edge Function

4. **Monitore logs:**
   ```bash
   supabase functions logs salvar-inscricao --follow
   ```

---

**Dúvidas?** Leia: `supabase/functions/salvar-inscricao/README.md`



