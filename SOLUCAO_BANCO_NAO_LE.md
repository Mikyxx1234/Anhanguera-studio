# 🔧 Solução: Site Não Está Lendo do Banco

## ❌ Problema Identificado

O arquivo `.env` estava **vazio**! Por isso o site não conseguia conectar ao Supabase.

---

## ✅ Solução Aplicada

### 1. **Criado arquivo `.env` com as credenciais**

Executei o script `criar-env.ps1` que criou o arquivo `.env` com:

```env
VITE_SUPABASE_URL=https://tufvduiaybogfhgausqj.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1ZnZkdWlheWJvZ2ZoZ2F1c3FqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwOTUyNjksImV4cCI6MjA3MjY3MTI2OX0.o-rO2rm5uYtI-NDp5amFm9gkXcToJWjuHDJFkaOtYtQ
```

---

## 🧪 Como Testar

### **Opção 1: Teste Rápido no Navegador**

1. **Abra o arquivo:** `testar-conexao.html` (no navegador)
2. **Clique nos botões:**
   - "Testar Graduação"
   - "Testar Pós-Graduação"
   - "Testar Inscrições"
3. **Veja os resultados:**
   - ✅ Se aparecer cursos = Banco funcionando
   - ❌ Se der erro = Problema de RLS (veja solução abaixo)

### **Opção 2: Rodar o Projeto**

**IMPORTANTE:** Você precisa **parar** e **iniciar novamente** o servidor para que as variáveis de ambiente sejam carregadas!

```powershell
# 1. PARE o servidor atual (Ctrl+C)

# 2. INICIE novamente
npm run dev
```

**Por que?** As variáveis de ambiente (`.env`) são carregadas apenas quando o servidor inicia. Se você já estava rodando `npm run dev` antes, ele não pegou as novas credenciais.

---

## 🔒 Possível Problema: RLS (Row Level Security)

Se mesmo após reiniciar o servidor os cursos não aparecerem, pode ser que as tabelas tenham RLS habilitado e não tenham policies públicas.

### **Como Verificar e Corrigir no Supabase:**

1. **Acesse:** https://supabase.com/dashboard/project/tufvduiaybogfhgausqj
2. **Vá em:** Table Editor
3. **Para cada tabela (`cursos_grad_anhanguera`, `cursos_pos_anhanguera`):**
   - Clique na tabela
   - Clique em "RLS" (Row Level Security) no topo
   - **Opção A (Recomendado):** Adicione uma policy de leitura pública:

```sql
-- Policy para cursos_grad_anhanguera
CREATE POLICY "Permitir leitura pública"
ON cursos_grad_anhanguera
FOR SELECT
TO public
USING (true);

-- Policy para cursos_pos_anhanguera
CREATE POLICY "Permitir leitura pública"
ON cursos_pos_anhanguera
FOR SELECT
TO public
USING (true);
```

   - **Opção B (Mais Simples):** Desabilite o RLS nessas tabelas (clique no botão "Disable RLS")

**Obs:** A tabela `inscricoes` já tem policy de inserção, então não precisa mexer.

---

## 📋 Checklist de Verificação

Execute este checklist na ordem:

- [x] **1. Arquivo `.env` existe e tem as credenciais** ✅
- [ ] **2. Servidor foi reiniciado** (IMPORTANTE!)
- [ ] **3. Console do navegador mostra:** `✅ X cursos carregados do banco Supabase`
- [ ] **4. Se não aparecer cursos:** Verificar RLS no Supabase

---

## 🎯 Passos Finais

### **1. Parar o Servidor Atual**
```powershell
# No terminal onde está rodando, pressione:
Ctrl + C
```

### **2. Iniciar Novamente**
```powershell
npm run dev
```

### **3. Abrir o Site**
```
http://localhost:5174/graduacao
```

### **4. Verificar Console do Navegador**
- Pressione `F12`
- Aba "Console"
- Procure por: `✅ X cursos carregados do banco Supabase`

---

## 🔍 Logs para Verificar

### **Se estiver funcionando:**
```
✅ 63 cursos carregados do banco Supabase
```

### **Se tiver problema de RLS:**
```
❌ Erro ao buscar cursos: {
  message: "permission denied for table cursos_grad_anhanguera",
  code: "42501"
}
⚠️ Nenhum curso encontrado no banco, usando dados locais
```

### **Se tiver problema de credenciais:**
```
❌ Erro ao buscar cursos: {
  message: "Invalid API key",
  code: "401"
}
```

---

## 🚨 Se Ainda Não Funcionar

Execute este SQL no Supabase para garantir que as policies estão corretas:

```sql
-- 1. Ver as policies atuais
SELECT tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('cursos_grad_anhanguera', 'cursos_pos_anhanguera');

-- 2. Remover policies antigas (se necessário)
DROP POLICY IF EXISTS "Permitir leitura pública" ON cursos_grad_anhanguera;
DROP POLICY IF EXISTS "Permitir leitura pública" ON cursos_pos_anhanguera;

-- 3. Criar policies de leitura pública
CREATE POLICY "Permitir leitura pública"
ON cursos_grad_anhanguera
FOR SELECT
TO public
USING (true);

CREATE POLICY "Permitir leitura pública"
ON cursos_pos_anhanguera
FOR SELECT
TO public
USING (true);

-- 4. Habilitar RLS (se estiver desabilitado)
ALTER TABLE cursos_grad_anhanguera ENABLE ROW LEVEL SECURITY;
ALTER TABLE cursos_pos_anhanguera ENABLE ROW LEVEL SECURITY;
```

---

## ✅ Resumo da Solução

1. ✅ **Arquivo `.env` criado** com credenciais do Supabase
2. ⚠️ **REINICIE o servidor** (`npm run dev`)
3. ✅ **Verifique o console** do navegador (F12)
4. ⚠️ **Se necessário:** Configure RLS no Supabase

**A causa mais provável era o arquivo `.env` vazio. Agora deve funcionar!** 🎉

