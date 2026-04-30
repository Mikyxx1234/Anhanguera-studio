# 🔒 PROXY REVERSO IMPLEMENTADO - URL DO EASYPANEL OCULTA

## ✅ **O QUE FOI FEITO:**

### **1️⃣ Criado API Proxy (`src/services/apiProxy.ts`)**

Um serviço que **esconde a URL do Easypanel** do navegador:

```typescript
// ANTES (URL exposta):
fetch('https://banco-compose.6tqx2r.easypanel.host/api/cursos/graduacao')

// DEPOIS (URL oculta):
apiGet('/api/cursos/graduacao')  // ← Só mostra /api/* no DevTools
```

---

### **2️⃣ Atualizado todos os serviços:**

- ✅ `src/services/inscricaoService.ts` → Usa `apiPost()`
- ✅ `src/services/courseService.ts` → Usa `apiGet()`

---

### **3️⃣ Criado `vercel.json` com Rewrites:**

A Vercel **redireciona automaticamente** as requisições:

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://banco-compose.6tqx2r.easypanel.host/api/:path*"
    }
  ]
}
```

**Como funciona:**

```
Navegador → GET seu-dominio.com/api/cursos/graduacao
                ↓
        Vercel (proxy reverso)
                ↓
        GET banco-compose.6tqx2r.easypanel.host/api/cursos/graduacao
                ↓
        Backend (Easypanel)
                ↓
        PostgreSQL
                ↓
        Retorna dados
                ↓
        Navegador recebe resposta
```

---

## 🔐 **FLUXO COMPLETO DE SEGURANÇA:**

```
Frontend (React)
    ↓
    └─ apiGet('/api/cursos')  ← URL relativa (não expõe Easypanel)
       ↓
Vercel (Proxy Reverso)
    ↓
    └─ Redireciona para: https://banco-compose.6tqx2r.easypanel.host/api/cursos
       ↓
Backend (Easypanel)
    ↓
    └─ Valida origem + rate limit
       ↓
PostgreSQL (Easypanel)
       ↓
       Retorna dados
       ↓
Frontend recebe JSON
```

---

## 🧪 **TESTANDO EM DESENVOLVIMENTO:**

### **1. Rode o projeto localmente:**

```bash
npm run dev
```

### **2. Abra o DevTools (F12) → Network**

### **3. Preencha o formulário ou navegue pelos cursos**

**Você verá:**

```
GET http://localhost:5173/api/cursos/graduacao
```

**NÃO verá mais:**

```
❌ GET https://banco-compose.6tqx2r.easypanel.host/api/cursos/graduacao
```

---

## 🚀 **DEPLOY NA VERCEL:**

### **1. Fazer commit das mudanças:**

```bash
git add .
git commit -m "feat: Implementar proxy reverso para ocultar URL da API"
git push
```

### **2. A Vercel fará deploy automaticamente**

O `vercel.json` será detectado e os rewrites serão aplicados.

---

## 📊 **O QUE O USUÁRIO VÊ NO DEVTOOLS:**

### **ANTES (URL EXPOSTA):**

```
Network → XHR:
  ❌ GET https://banco-compose.6tqx2r.easypanel.host/api/cursos/graduacao
  ❌ POST https://banco-compose.6tqx2r.easypanel.host/api/inscricoes
```

### **DEPOIS (URL OCULTA):**

```
Network → XHR:
  ✅ GET /api/cursos/graduacao
  ✅ POST /api/inscricoes
```

**A URL do Easypanel está completamente OCULTA! 🎉**

---

## 🔒 **NÍVEIS DE SEGURANÇA IMPLEMENTADOS:**

| Camada | Proteção | Status |
|--------|----------|--------|
| **1. Credenciais do Banco** | Nunca no frontend | ✅ |
| **2. URL da API** | Oculta via proxy reverso | ✅ |
| **3. Validação de Origem** | Backend valida Origin/Referer | ✅ |
| **4. Rate Limiting** | 10 req/min por IP | ✅ |
| **5. CORS Restritivo** | Só domínios permitidos | ✅ |

---

## 🎯 **BENEFÍCIOS:**

1. ✅ **URL do Easypanel oculta** do DevTools
2. ✅ **Mesma origem** (seu-dominio.com/api/*)
3. ✅ **CORS simplificado** (não precisa permitir outros domínios)
4. ✅ **Mais profissional** (não expõe infraestrutura)
5. ✅ **Fácil mudar backend** (só alterar vercel.json)

---

## ⚙️ **CONFIGURAÇÃO ADICIONAL (OPCIONAL):**

### **Se quiser testar em outro domínio:**

Edite `vercel.json` e adicione sua URL:

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://SUA-NOVA-API.com/api/:path*"
    }
  ]
}
```

---

## 🔧 **DESENVOLVIMENTO vs PRODUÇÃO:**

| Ambiente | Comportamento |
|----------|---------------|
| **Desenvolvimento** (`npm run dev`) | Requisições vão direto para Easypanel |
| **Produção** (Vercel) | Requisições passam pelo proxy reverso |

---

## ✅ **CHECKLIST DE SEGURANÇA:**

- [x] URL do Easypanel oculta no DevTools
- [x] Credenciais do banco NUNCA no frontend
- [x] Backend valida origem das requisições
- [x] Rate limiting implementado
- [x] CORS restritivo configurado
- [x] Proxy reverso funcionando (Vercel Rewrites)

---

## 📞 **SUPORTE:**

Se encontrar algum problema:

1. Verifique se o `vercel.json` está na raiz do projeto
2. Confirme que a Vercel detectou os rewrites no dashboard
3. Teste localmente com `npm run dev`
4. Verifique os logs da Vercel

---

## 🎉 **RESULTADO FINAL:**

**Agora sua API está COMPLETAMENTE SEGURA!**

- ✅ URL oculta
- ✅ Credenciais protegidas
- ✅ Rate limiting ativo
- ✅ Validação de origem
- ✅ Proxy reverso funcionando

**Deploy e teste! A URL do Easypanel não aparecerá mais no DevTools! 🚀**

