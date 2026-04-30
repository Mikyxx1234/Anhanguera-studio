# 🚀 COMO CRIAR A API PROXY NO EASYPANEL

## 📁 O QUE FOI CRIADO

✅ `api-proxy-simples.js` - API completa em 1 arquivo  
✅ `package-proxy.json` - Dependências  
✅ `Dockerfile-proxy` - Container Docker  

---

## 🎯 PASSO A PASSO (5 MINUTOS)

### **1️⃣ No Easypanel**

1. Volte para o projeto "banco"
2. Clique em **"+ Service"**
3. Clique em **"App"**
4. Escolha **"Compose"**

---

### **2️⃣ Cole este código:**

```yaml
version: '3.8'

services:
  api-proxy:
    image: node:18-alpine
    working_dir: /app
    command: sh -c "npm install pg@^8.11.3 && node server.js"
    ports:
      - "3000:3000"
    environment:
      DB_HOST: banco_banco
      DB_PORT: 5432
      DB_NAME: site_anhanguera
      DB_USER: postgres
      DB_PASSWORD: ^&TN5Qkg3BTXpW#eeqHj@E
      SECRET_TOKEN: 7a8f9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a
      PORT: 3000
    volumes:
      - ./api-proxy-simples.js:/app/server.js:ro
    restart: unless-stopped
```

---

### **3️⃣ Fazer Upload do Arquivo**

**PROBLEMA:** O compose precisa do arquivo `api-proxy-simples.js`

**SOLUÇÃO ALTERNATIVA - Usar imagem Docker:**

1. No seu terminal local:

```bash
# Construir imagem
docker build -f Dockerfile-proxy -t SEU_USUARIO/anhanguera-proxy:latest .

# Login no Docker Hub
docker login

# Push
docker push SEU_USUARIO/anhanguera-proxy:latest
```

2. No Easypanel, use:

```yaml
version: '3.8'

services:
  api-proxy:
    image: SEU_USUARIO/anhanguera-proxy:latest
    ports:
      - "3000:3000"
    environment:
      DB_HOST: banco_banco
      DB_PORT: 5432
      DB_NAME: site_anhanguera
      DB_USER: postgres
      DB_PASSWORD: ^&TN5Qkg3BTXpW#eeqHj@E
      SECRET_TOKEN: 7a8f9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a
      PORT: 3000
    restart: unless-stopped
```

---

### **4️⃣ Deploy**

Clique em **"Deploy"** e aguarde 1-2 minutos

---

### **5️⃣ Adicionar Domínio**

1. Vá em **"Domains"**
2. Adicione: `api.seusite.com`
3. Aguarde SSL

---

### **6️⃣ Testar**

```
https://api.seusite.com/health
```

Deve retornar: `{"status":"ok","message":"API Proxy funcionando!"}`

---

### **7️⃣ Atualizar Frontend**

Edite `.env`:

```env
VITE_API_URL=https://api.seusite.com
VITE_INSCRICAO_SECRET_TOKEN=7a8f9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a
```

---

## ✅ PRONTO!

Agora funciona **IGUAL AO SUPABASE**, mas no seu servidor! 🎉

