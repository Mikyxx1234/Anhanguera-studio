# ✅ CONFIGURAÇÃO FINAL - API MIGRADA

## 🎯 O QUE FOI FEITO

✅ **inscricaoService.ts** - 100% migrado para o PostgreSQL  
⚠️ **courseService.ts** - Ainda usa Supabase (apenas para BUSCAR cursos - só leitura)

---

## ⚙️ CONFIGURAR O ARQUIVO .env

Crie/edite o arquivo `.env` na raiz do projeto com:

```env
# API Backend no Easypanel
VITE_API_URL=http://banco-compose.6tqx2r.easypanel.host

# Token secreto (mesmo configurado no backend)
VITE_INSCRICAO_SECRET_TOKEN=7a8f9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a

# Supabase (ainda usado para buscar dados de cursos)
VITE_SUPABASE_URL=https://tufvduiaybogfhgausqj.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1ZnZkdWlheWJvZ2ZoZ2F1c3FqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwOTUyNjksImV4cCI6MjA3MjY3MTI2OX0.o-rO2rm5uYtI-NDp5amFm9gkXcToJWjuHDJFkaOtYtQ
```

---

## 🚀 TESTAR

### 1️⃣ Reiniciar o servidor

```bash
# Parar o servidor (Ctrl+C se estiver rodando)
# Iniciar novamente
npm run dev
```

### 2️⃣ Testar no site

1. Acesse `http://localhost:5173` (ou sua porta)
2. Preencha o formulário "Inscreva-se" ou clique em "Ver preço"
3. Preencha:
   - Nome: Teste Site
   - Telefone: 11999999999
4. Envie

### 3️⃣ Verificar no banco

1. Acesse: https://banco-banco-dbgate.6tqx2r.easypanel.host/
2. Abra a tabela `inscricoes`
3. Procure pelo registro "Teste Site"

✅ **Se aparecer = FUNCIONOU!**

---

## 🔍 DEBUG

Se NÃO gravar, abra o Console do navegador (F12) e veja se há erros.

**Erros comuns:**

### "CORS error"
- A API backend precisa ter CORS configurado
- Já está configurado no código!

### "Failed to fetch"
- Verifique se a URL está correta no `.env`
- Verifique se o serviço está rodando no Easypanel

### "Unauthorized"
- O token está diferente entre frontend e backend
- Verifique se é o mesmo em ambos

---

## 📊 FLUXO ATUAL

```
INSCRIÇÕES (salvar leads):
Site → API Easypanel → PostgreSQL Easypanel ✅

CURSOS (buscar preços):
Site → Supabase → PostgreSQL Supabase ⚠️
```

**Nota:** O Supabase ainda é usado para buscar dados de cursos (preços, informações).  
Isso é **só leitura** e não tem problema. Se quiser migrar isso também, precisamos  
criar endpoints na API para buscar cursos.

---

## ✅ CHECKLIST

- [ ] Arquivo `.env` criado com as variáveis corretas
- [ ] Servidor reiniciado (`npm run dev`)
- [ ] Testado o formulário do site
- [ ] Verificado no DBGate se o registro apareceu
- [ ] Console do navegador (F12) sem erros

---

## 🎉 PRONTO!

Agora todas as **INSCRIÇÕES** vão direto para o seu PostgreSQL no Easypanel!

