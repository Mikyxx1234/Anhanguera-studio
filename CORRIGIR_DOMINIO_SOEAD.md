# 🔧 Correção para Novo Domínio soead.com.br

## ❌ Problema Identificado

Após trocar o domínio DNS para `https://soead.com.br`, as páginas que se conectam ao banco de dados pararam de funcionar. O problema era que o backend não tinha o novo domínio na lista de origens permitidas (CORS).

---

## ✅ Correções Aplicadas

### 1. **Backend atualizado com novo domínio**

O arquivo `backend/index.js` foi atualizado para incluir o domínio `soead.com.br` na lista de origens permitidas (ALLOWED_ORIGINS).

### 2. **Variáveis de ambiente atualizadas**

O arquivo `backend/VARIAVEIS_EASYPANEL.txt` foi atualizado com:
```
FRONTEND_URL=https://soead.com.br
```

---

## 🚀 Passos para Aplicar a Correção

### **MÉTODO SIMPLES (RECOMENDADO)** ⭐

O código já foi corrigido e já inclui o domínio `soead.com.br` na lista de origens permitidas. Você só precisa fazer o deploy:

#### **1. Fazer deploy do novo código:**

```bash
# No seu terminal (no diretório do projeto Anhanguera):
git add .
git commit -m "Adicionar domínio soead.com.br nas origens permitidas"
git push
```

#### **2. No EasyPanel:**
- Vá em: **Services** → **banco-compose** (ou nome do serviço backend)
- O deploy deve iniciar automaticamente ao detectar o push
- Se não iniciar, clique em: **Rebuild** ou **Redeploy**
- Aguarde o deploy terminar
- Clique em: **Restart** (se necessário)

✅ **Pronto!** O site já deve funcionar.

---

### **MÉTODO COMPLETO (OPCIONAL)**

Se você quiser configurar a variável de ambiente também (recomendado para melhor controle):

1. **Acesse o EasyPanel:**
   - URL: https://easypanel.host/ (ou seu painel de controle)
   - Entre no projeto onde está o backend (`banco-compose`)

2. **Adicione/Atualize a variável de ambiente:**
   - Vá em: **Services** → **banco-compose** (ou o nome do seu serviço de backend)
   - Procure por: **Environment Variables** ou **Variáveis de Ambiente**
   - **Se a variável `FRONTEND_URL` existe:** Altere o valor para `https://soead.com.br`
   - **Se NÃO existe:** Clique em **Add Variable** (ou **Adicionar Variável**) e crie:
     - Nome: `FRONTEND_URL`
     - Valor: `https://soead.com.br`

3. **Faça o deploy do novo código:**

   **Opção A: Deploy via Git (Recomendado)**
   ```bash
   # No seu terminal (no diretório do projeto):
   git add .
   git commit -m "Adicionar domínio soead.com.br nas origens permitidas"
   git push
   ```
   
   O EasyPanel irá detectar automaticamente o push e fazer o deploy.

   **Opção B: Deploy manual**
   - No EasyPanel, vá em: **Services** → **banco-compose**
   - Clique em: **Rebuild** ou **Redeploy**

4. **Reinicie o serviço:**
   - No EasyPanel, após o deploy, clique em: **Restart**
   - Aguarde alguns segundos até o serviço estar online novamente

---

## 📸 Como Adicionar Variável de Ambiente no EasyPanel

Se você não encontrou a variável `FRONTEND_URL`, siga estes passos:

### **Passo 1: Localize o Serviço**
1. No EasyPanel, vá em **Services** (no menu lateral)
2. Procure pelo serviço do backend (provavelmente chamado `banco-compose` ou `backend`)
3. Clique no serviço para abri-lo

### **Passo 2: Encontre Environment Variables**
1. Dentro do serviço, procure pela aba/seção **Environment** ou **Environment Variables**
2. Você verá uma lista de variáveis existentes como:
   - `DB_HOST`
   - `DB_PORT`
   - `DB_NAME`
   - `DB_USER`
   - `DB_PASSWORD`
   - `SECRET_TOKEN`
   - etc.

### **Passo 3: Adicionar Nova Variável**
1. Procure pelo botão **Add Variable**, **Add Environment Variable** ou **+ Adicionar**
2. Clique nele
3. Preencha:
   - **Key/Name/Nome:** `FRONTEND_URL`
   - **Value/Valor:** `https://soead.com.br`
4. Clique em **Save** ou **Salvar**

### **Passo 4: Se a variável já existir**
Se você encontrar a variável `FRONTEND_URL` mas ela está com outro valor (ex: `https://seu-site.com`):
1. Clique no ícone de editar (✏️) ou diretamente no valor
2. Altere para: `https://soead.com.br`
3. Salve

### **⚠️ IMPORTANTE:**
Após adicionar/alterar a variável, você **DEVE**:
1. Fazer o deploy do novo código (push para git)
2. **Reiniciar o serviço** no EasyPanel

---

## 🧪 Como Testar

### **Teste 1: Health Check da API**

Acesse no navegador:
```
https://banco-compose.6tqx2r.easypanel.host/health
```

Resposta esperada:
```json
{
  "status": "ok",
  "message": "API Anhanguera funcionando!",
  "timestamp": "2024-..."
}
```

### **Teste 2: Verificar origens permitidas**

No console do backend (EasyPanel → Logs), você deve ver algo como:
```
🌐 Origins permitidos: http://localhost:5173, ..., https://soead.com.br, ...
```

### **Teste 3: Testar no site**

1. **Acesse:** https://soead.com.br/graduacao
2. **Abra o console do navegador** (F12)
3. **Verifique os logs:**
   - ✅ Deve mostrar: `✅ X cursos carregados do banco Supabase`
   - ❌ Se mostrar erro de CORS, veja a seção de Troubleshooting abaixo

---

## 🔍 Troubleshooting

### **Erro de CORS ainda persiste**

Se você ainda vê erros de CORS como:
```
Access to fetch at 'https://banco-compose...' from origin 'https://soead.com.br' 
has been blocked by CORS policy
```

**Solução:**
1. Verifique se o backend foi realmente atualizado com o novo código
2. Confirme que a variável `FRONTEND_URL` está com o valor correto no EasyPanel
3. Reinicie o serviço no EasyPanel
4. Limpe o cache do navegador (Ctrl+Shift+Delete)

### **Erro 401 (Unauthorized)**

Se você vê erro 401, pode ser o token secreto:

**Solução:**
1. No Bolt.new, verifique se a variável de ambiente está configurada:
   - Clique no ícone de engrenagem (Settings)
   - Procure por: **Environment Variables**
   - Adicione: `VITE_INSCRICAO_SECRET_TOKEN=7a8f9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a`

### **Dados não aparecem (erro 403 ou permission denied)**

Se os cursos não aparecem e o console mostra erro de permissão:

**Solução:**
Verifique o RLS (Row Level Security) no Supabase:

1. Acesse: https://supabase.com/dashboard/project/tufvduiaybogfhgausqj
2. Vá em: **SQL Editor**
3. Execute:
```sql
-- Verificar se as policies existem
SELECT tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('cursos_grad_anhanguera', 'cursos_pos_anhanguera');

-- Se não tiver policies, criar:
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
```

---

## 📋 Checklist de Verificação

Execute este checklist na ordem:

- [x] **1. Código do backend atualizado** ✅
- [ ] **2. Variável `FRONTEND_URL` atualizada no EasyPanel**
- [ ] **3. Deploy do novo código feito**
- [ ] **4. Serviço reiniciado no EasyPanel**
- [ ] **5. Health check respondendo OK** (`/health`)
- [ ] **6. Site carregando dados do banco**
- [ ] **7. Console do navegador sem erros de CORS**

---

## 🎯 Resumo

### **O que foi alterado no código:**

1. **backend/index.js** - Adicionados os domínios:
   - `https://soead.com.br`
   - `http://soead.com.br`
   - `soead.com.br`

2. **backend/VARIAVEIS_EASYPANEL.txt** - Atualizado:
   - `FRONTEND_URL=https://soead.com.br`

### **O que você precisa fazer:**

1. ✅ **Atualizar variável `FRONTEND_URL` no EasyPanel**
2. ✅ **Fazer deploy do novo código**
3. ✅ **Reiniciar o serviço**
4. ✅ **Testar o site**

---

## 🚨 Importante

- **Não há mais alterações necessárias no código**
- **Apenas precisa aplicar as mudanças no EasyPanel**
- **O domínio soead.com.br já está configurado no backend**

---

## 💡 Dica

Se você estiver usando o Bolt.new para hospedar o frontend, certifique-se de que:
1. As variáveis de ambiente estão configuradas no Bolt
2. O site foi republicado após configurar o novo domínio DNS

---

## ✅ Tudo Pronto!

Após seguir estes passos, o site `https://soead.com.br` deve estar funcionando perfeitamente com o banco de dados! 🎉

Se ainda tiver problemas, verifique os logs do backend no EasyPanel para ver se há alguma mensagem de erro específica.

