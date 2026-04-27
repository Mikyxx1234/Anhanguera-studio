# 🚀 DEPLOY NO EASYPANEL - PASSO A PASSO RÁPIDO

## ✅ INFORMAÇÕES DO SEU BANCO

```
✓ Host interno: banco_banco
✓ Port: 5432
✓ Database: site_anhanguera
✓ User: postgres
✓ Password: ^&TN5Qkg3BTXpW#eeqHj@E
```

---

## 📋 PASSO A PASSO (10 MINUTOS)

### **1️⃣ Fazer Commit do Código**

No terminal do seu projeto:

```bash
git add backend/
git commit -m "feat: adicionar API backend"
git push origin main
```

---

### **2️⃣ No Easypanel - Criar Serviço**

1. Acesse: http://168.231.99.126:3000
2. Entre no projeto **"banco"**
3. Clique em **"+ Service"**
4. Clique em **"App"**

---

### **3️⃣ Configurar Deploy via GitHub**

1. Clique em **"GitHub"** (ou GitLab se usar)
2. Autorize se for a primeira vez
3. Selecione seu repositório
4. Configure:
   - **Branch:** `main` (ou `master`)
   - **Build Context:** `/backend`
   - **Dockerfile:** `Dockerfile`

**OU use Docker Compose:**

```yaml
version: '3.8'

services:
  api-backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      DB_HOST: banco_banco
      DB_PORT: 5432
      DB_NAME: site_anhanguera
      DB_USER: postgres
      DB_PASSWORD: ^&TN5Qkg3BTXpW#eeqHj@E
      DB_SSL: false
      SECRET_TOKEN: 7a8f9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a
      FRONTEND_URL: https://seu-site.com
      PORT: 3000
    restart: unless-stopped
```

---

### **4️⃣ Adicionar Variáveis de Ambiente**

Na seção **"Environment Variables"**, adicione EXATAMENTE isto:

```
DB_HOST=banco_banco
DB_PORT=5432
DB_NAME=site_anhanguera
DB_USER=postgres
DB_PASSWORD=^&TN5Qkg3BTXpW#eeqHj@E
DB_SSL=false
SECRET_TOKEN=7a8f9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a
FRONTEND_URL=https://seu-site.com
PORT=3000
```

⚠️ **Troque `https://seu-site.com` pela URL real do seu site!**

---

### **5️⃣ Fazer Deploy**

1. Clique em **"Deploy"** ou **"Create Service"**
2. Aguarde 2-3 minutos (vai fazer build do Docker)
3. Veja os logs:
   ```
   🚀 API Anhanguera iniciada!
   ✅ Conectado ao banco de dados PostgreSQL!
   ```

---

### **6️⃣ Expor com Domínio**

1. No serviço criado, vá em **"Domains"**
2. Clique em **"Add Domain"**
3. Configure:
   - **Domain:** `api.seudominio.com` (ou crie um subdomínio)
   - **Port:** `3000`
4. Aguarde SSL ser gerado (1-2 minutos)

---

### **7️⃣ TESTAR A API**

Abra no navegador:

#### Teste 1: Health Check
```
https://api.seudominio.com/health
```

Deve retornar:
```json
{
  "status": "ok",
  "message": "API Anhanguera funcionando!",
  "timestamp": "2024-..."
}
```

#### Teste 2: Conexão com Banco
```
https://api.seudominio.com/health/db
```

Deve retornar:
```json
{
  "status": "ok",
  "message": "Conexão com banco OK!",
  "timestamp": "2024-..."
}
```

---

### **8️⃣ Testar no Postman**

#### Salvar inscrição (COM token):
```
POST https://api.seudominio.com/api/inscricoes

Headers:
  Content-Type: application/json
  X-Secret-Token: 7a8f9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a

Body (raw JSON):
{
  "nome_completo": "Teste Backend",
  "celular": "11999999999",
  "tipo_de_curso": "graduacao",
  "pagina": "teste-easypanel"
}
```

**Resultado esperado:** `201 Created` + `{"success": true, "id": "..."}`

#### Verificar no banco:
```
https://banco-banco-dbgate.6tqx2r.easypanel.host/
```

Na tabela `inscricoes`, deve aparecer o registro "Teste Backend"!

---

### **9️⃣ Configurar o Frontend**

Crie/edite o arquivo `.env` na raiz do projeto do site:

```env
# URL da API Backend no Easypanel
VITE_API_URL=https://api.seudominio.com

# Token secreto (mesmo do backend)
VITE_INSCRICAO_SECRET_TOKEN=7a8f9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a
```

---

### **🔟 Testar o Site Completo**

1. Acesse seu site
2. Preencha o formulário "Inscreva-se" ou "Ver preço"
3. Clique em enviar
4. Verifique no DBGate se o registro foi salvo
5. **FUNCIONOU!** 🎉

---

## 🎯 CHECKLIST

- [ ] Código backend commitado e no GitHub
- [ ] Serviço criado no Easypanel (projeto "banco")
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy realizado com sucesso
- [ ] Logs mostram "Conectado ao banco"
- [ ] Domínio adicionado (ex: api.seudominio.com)
- [ ] `/health` retorna OK
- [ ] `/health/db` retorna OK
- [ ] POST via Postman funciona
- [ ] Registro aparece no DBGate
- [ ] `.env` criado no frontend
- [ ] Site funcionando e salvando no banco

---

## 🆘 PROBLEMAS COMUNS

### "Erro ao conectar no banco"
✓ Verifique se `DB_HOST=banco_banco` está correto  
✓ Confirme que os serviços estão no mesmo projeto  
✓ Veja os logs do container

### "Token inválido"
✓ Confirme que o token no `.env` do frontend é o mesmo do backend  
✓ Veja se o header `X-Secret-Token` está sendo enviado

### "CORS error"
✓ Configure `FRONTEND_URL` com a URL correta do seu site  
✓ Certifique-se que o site está fazendo requisição para `https://api...`

---

## ✅ PRONTO!

Agora você tem:

✅ API Backend rodando no Easypanel  
✅ Conectada ao seu PostgreSQL  
✅ Protegida com token secreto  
✅ Site salvando dados no seu banco  
✅ Sem depender do Supabase  

**Parabéns! 🎉**

