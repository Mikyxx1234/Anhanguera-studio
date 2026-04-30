# ✅ Ajustes Cursos Técnicos - Concluído

## 🎯 Alterações Realizadas

### **1. ✅ Preços dos Cursos Técnicos**

**Todos os cursos técnicos agora custam R$ 199,00**

#### **Preços ANTES:**
- Desenho de Construção Civil: R$ 199,90
- Marketing: R$ 179,90
- Vendas: R$ 179,90
- Administração: R$ 179,90
- Contabilidade: R$ 189,90
- Logística: R$ 179,90
- Desenvolvimento de Sistemas: R$ 219,90
- Manutenção e Suporte: R$ 209,90

#### **Preços AGORA (TODOS):**
- ✅ **R$ 199,00** (todos os 8 cursos técnicos)

---

### **2. ✅ Tipo de Curso na Tabela `inscricoes`**

**Quando for curso técnico, salva `tipo_de_curso = 'curso-tecnico'`**

#### **Lógica Implementada:**
```typescript
// Determinar tipo de curso baseado no formation
let tipoDeCurso = 'graduacao'; // Padrão

if (course.formation === 'MBA' || course.formation === 'Especialista') {
  tipoDeCurso = 'pos-graduacao';
} else if (course.formation === 'Técnico') {
  tipoDeCurso = 'curso-tecnico'; // ✅ NOVO!
}
```

#### **Valores possíveis para `tipo_de_curso`:**
- `'graduacao'` - Bacharelado, Licenciatura, Tecnólogo
- `'pos-graduacao'` - MBA, Especialista
- `'curso-tecnico'` - Cursos Técnicos ✅ NOVO

---

## 📊 Exemplo de Dados Salvos

### **Lead de Curso Técnico:**
```json
{
  "nome_completo": "Carlos Silva",
  "celular": "(11) 99999-9999",
  "email": null,
  "tipo_de_curso": "curso-tecnico",  ← ✅ NOVO VALOR
  "pagina": "cursos-tecnicos",
  "nome_curso": "Técnico em Marketing",
  "status": "novo"
}
```

---

## 🔧 Atualização Necessária no Supabase

### **⚠️ IMPORTANTE: Você precisa executar este SQL no Supabase!**

A tabela `inscricoes` tem uma constraint que precisa ser atualizada para aceitar `'curso-tecnico'`.

#### **Execute no Supabase SQL Editor:**

```sql
-- 1. Remover constraint antiga
ALTER TABLE inscricoes 
DROP CONSTRAINT IF EXISTS inscricoes_tipo_de_curso_check;

-- 2. Criar nova constraint com 'curso-tecnico'
ALTER TABLE inscricoes
ADD CONSTRAINT inscricoes_tipo_de_curso_check
CHECK (tipo_de_curso = ANY (ARRAY[
  'graduacao'::text, 
  'pos-graduacao'::text, 
  'curso-tecnico'::text
]));
```

**Ou execute o arquivo completo:** `atualizar-constraint-curso-tecnico.sql`

---

## 🧪 Como Testar

### **Teste 1: Verificar Preço**
1. Acesse: `http://localhost:5174/cursos-tecnicos`
2. Clique em "Ver preço" em **qualquer** curso técnico
3. Preencha nome e telefone
4. **Verificar:** Preço exibido deve ser **R$ 199,00**

### **Teste 2: Verificar Salvamento**
1. Acesse: `http://localhost:5174/cursos-tecnicos`
2. Clique em "Ver preço" em "Técnico em Marketing"
3. Preencha e envie
4. Abra o console (F12)
5. Veja: `📝 Dados do lead preparados`
6. **Verificar no console:**
   ```javascript
   {
     tipo_de_curso: "curso-tecnico",  // ✅ Deve estar assim
     pagina: "cursos-tecnicos",
     nome_curso: "Técnico em Marketing"
   }
   ```

### **Teste 3: Verificar no Supabase**
1. Execute o SQL de atualização (acima)
2. Preencha formulário de curso técnico
3. No Supabase, vá em: Table Editor → `inscricoes`
4. Veja o registro mais recente
5. **Verificar:**
   - `tipo_de_curso` = `curso-tecnico` ✅
   - `pagina` = `cursos-tecnicos` ✅
   - `nome_curso` = nome do curso clicado ✅

---

## 📂 Arquivos Modificados

### **1. `src/data/technicalCourses.ts`**
- ✅ Alterados todos os preços para `199.00`

**Linhas modificadas:**
```typescript
price: 199.00  // Todos os 8 cursos
```

### **2. `src/components/PriceModal.tsx`**
- ✅ Adicionada lógica para detectar curso técnico
- ✅ Salva `tipo_de_curso = 'curso-tecnico'`

**Linhas adicionadas (78-83):**
```typescript
let tipoDeCurso = 'graduacao';
if (course.formation === 'MBA' || course.formation === 'Especialista') {
  tipoDeCurso = 'pos-graduacao';
} else if (course.formation === 'Técnico') {
  tipoDeCurso = 'curso-tecnico';  // ✅ NOVO
}
```

---

## 📋 Checklist de Verificação

- [x] ✅ Todos preços alterados para R$ 199,00
- [x] ✅ Código detecta curso técnico
- [x] ✅ Salva `tipo_de_curso = 'curso-tecnico'`
- [x] ✅ Compilado sem erros
- [ ] ⚠️ **VOCÊ PRECISA:** Executar SQL no Supabase
- [ ] Testar no site
- [ ] Verificar dados no Supabase

---

## 🚨 Ação Necessária

### **Você PRECISA executar este SQL no Supabase:**

Acesse: https://supabase.com/dashboard/project/tufvduiaybogfhgausqj/sql/new

Cole e execute:
```sql
ALTER TABLE inscricoes 
DROP CONSTRAINT IF EXISTS inscricoes_tipo_de_curso_check;

ALTER TABLE inscricoes
ADD CONSTRAINT inscricoes_tipo_de_curso_check
CHECK (tipo_de_curso = ANY (ARRAY[
  'graduacao'::text, 
  'pos-graduacao'::text, 
  'curso-tecnico'::text
]));
```

**Sem isso, os leads de cursos técnicos NÃO serão salvos!**

---

## ✅ Resumo

### **O que mudou:**
1. ✅ Todos cursos técnicos = R$ 199,00
2. ✅ Campo `tipo_de_curso` = `'curso-tecnico'` para técnicos

### **O que NÃO mudou:**
- ✅ Graduação continua funcionando normal
- ✅ Pós-graduação continua funcionando normal
- ✅ Validação de telefone mantida
- ✅ Detecção automática de página mantida

### **Status:**
- ✅ Código atualizado
- ✅ Compilado sem erros
- ⚠️ **FALTA:** Atualizar constraint no Supabase

**Após executar o SQL, tudo estará 100% funcional!** 🎉

