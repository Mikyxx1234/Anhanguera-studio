# 🚨 SOLUÇÃO URGENTE - Banco Não Carrega

## ❌ Problema
As páginas de graduação e pós-graduação **NÃO** estão carregando cursos do banco Supabase.

## 🎯 Causa Provável
**RLS (Row Level Security)** bloqueando leitura pública das tabelas.

---

## ✅ SOLUÇÃO PASSO A PASSO

### **PASSO 1: Testar Conexão**

1. **Arquivo `testar-conexao.html` foi aberto no navegador**
2. **Clique nos botões:**
   - "Testar Graduação"
   - "Testar Pós-Graduação"

**O que deve acontecer:**
- ✅ **Se mostrar cursos:** Conexão OK, problema é no código
- ❌ **Se der erro de permissão:** Problema é RLS no Supabase

---

### **PASSO 2: Configurar Permissões no Supabase**

#### **2.1 - Acessar Supabase:**
1. Abra: https://supabase.com/dashboard
2. Entre no projeto: `tufvduiaybogfhgausqj`
3. Clique em **"SQL Editor"** no menu lateral

#### **2.2 - Executar SQL:**
1. **Copie TODO o conteúdo do arquivo:** `configurar-rls-tabelas.sql`
2. **Cole no SQL Editor**
3. **Execute** (botão "Run" ou Ctrl+Enter)

#### **2.3 - Verificar Resultado:**

**Se funcionou, você verá:**
```
✅ total_cursos_graduacao: 63 (ou outro número > 0)
✅ total_cursos_pos: 12 (ou outro número > 0)
✅ Lista de 5 cursos
```

**Se deu erro:**
```
❌ permission denied for table...
```
↓
**Execute apenas estas 3 linhas:**
```sql
ALTER TABLE cursos_grad_anhanguera DISABLE ROW LEVEL SECURITY;
ALTER TABLE cursos_pos_anhanguera DISABLE ROW LEVEL SECURITY;
ALTER TABLE inscricoes DISABLE ROW LEVEL SECURITY;
```

---

### **PASSO 3: Reiniciar Servidor (OBRIGATÓRIO)**

**No terminal onde está rodando o projeto:**

```powershell
# 1. PARE o servidor
Ctrl + C

# 2. INICIE novamente
npm run dev
```

**⚠️ IMPORTANTE:** Sem reiniciar, as variáveis do `.env` não são carregadas!

---

### **PASSO 4: Testar no Site**

1. **Acesse:** http://localhost:5174/graduacao
2. **Pressione F12** (abrir console)
3. **Veja a aba "Console"**

**Mensagens esperadas:**
```
✅ 63 cursos carregados do banco Supabase
```

**Se aparecer:**
```
⚠️ Nenhum curso encontrado no banco, usando dados locais
```
↓ **Volte ao PASSO 2** e configure o RLS

---

## 🔍 Debug - O Que Verificar

### **1. Console do Navegador (F12)**

Procure por erros em vermelho:

```javascript
// ❌ Erro de permissão:
{
  message: "permission denied for table cursos_grad_anhanguera",
  code: "42501"
}

// ❌ Erro de credenciais:
{
  message: "Invalid API key",
  code: "401"
}

// ❌ Erro de tabela não existe:
{
  message: "relation \"cursos_grad_anhanguera\" does not exist",
  code: "42P01"
}
```

### **2. Aba Network (F12 → Network)**

Procure por requisições para:
- `https://tufvduiaybogfhgausqj.supabase.co/rest/v1/cursos_grad_anhanguera`
- `https://tufvduiaybogfhgausqj.supabase.co/rest/v1/cursos_pos_anhanguera`

**Status esperado:** `200 OK`
**Se for:** `401` ou `403` → Problema de permissão

---

## 🆘 Soluções Alternativas

### **Se RLS não funcionar mesmo após configuração:**

#### **Opção A: Desabilitar RLS Completamente**
```sql
ALTER TABLE cursos_grad_anhanguera DISABLE ROW LEVEL SECURITY;
ALTER TABLE cursos_pos_anhanguera DISABLE ROW LEVEL SECURITY;
```

#### **Opção B: Criar Service Role (mais seguro)**
1. No Supabase, vá em: **Settings → API**
2. Copie a **service_role key** (NÃO a anon key)
3. Substitua no `.env`:
```env
VITE_SUPABASE_ANON_KEY=sua_service_role_key_aqui
```
⚠️ **ATENÇÃO:** Service role key NÃO deve ser exposta publicamente!

---

## 📊 Checklist de Verificação

Execute na ordem:

- [ ] 1. Arquivo `.env` existe e tem credenciais
- [ ] 2. `testar-conexao.html` foi testado no navegador
- [ ] 3. SQL de configuração RLS foi executado no Supabase
- [ ] 4. Servidor foi **REINICIADO** (npm run dev)
- [ ] 5. Console do navegador (F12) foi verificado
- [ ] 6. Mensagem `✅ X cursos carregados` apareceu

---

## 🎯 Teste Rápido no SQL Editor

Execute este SQL no Supabase para verificar se consegue ler:

```sql
-- Teste simples
SELECT COUNT(*) FROM cursos_grad_anhanguera;
SELECT COUNT(*) FROM cursos_pos_anhanguera;

-- Se der erro, execute:
ALTER TABLE cursos_grad_anhanguera DISABLE ROW LEVEL SECURITY;
ALTER TABLE cursos_pos_anhanguera DISABLE ROW LEVEL SECURITY;

-- Tente novamente:
SELECT COUNT(*) FROM cursos_grad_anhanguera;
SELECT COUNT(*) FROM cursos_pos_anhanguera;
```

---

## 📝 Resumo da Solução

1. ✅ `.env` criado com credenciais
2. ⚠️ **CONFIGURAR RLS no Supabase** (arquivo SQL)
3. ⚠️ **REINICIAR servidor** (npm run dev)
4. ✅ Verificar console do navegador (F12)

**O problema mais comum é RLS bloqueando leitura pública!**

---

## 🆘 Ainda Não Funcionou?

**Me envie:**
1. Screenshot do erro no console (F12)
2. Screenshot da aba Network (F12)
3. Resultado do SQL no Supabase:
   ```sql
   SELECT COUNT(*) FROM cursos_grad_anhanguera;
   ```

Com essas informações vou identificar exatamente o problema!

