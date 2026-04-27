# ✅ IMPLEMENTAÇÃO - CURSOS PROFISSIONALIZANTES

## 📋 Problema Identificado

A página de **cursos-profissionalizantes** não estava gravando os dados de inscrição no banco de dados, diferente das outras páginas (graduação, pós-MBA e cursos técnicos).

## 🔍 Análise Realizada

1. **Estrutura dos cursos profissionalizantes:**
   - Formation: `"Profissionalizante"`
   - Exemplos: Marketing Digital, Bartender, Cozinheiro, etc.

2. **Problema encontrado:**
   - O componente `PriceModal` não reconhecia cursos profissionalizantes
   - O banco de dados não tinha o valor `'curso-profissionalizante'` no constraint
   - A detecção de página não incluía `/cursos-profissionalizantes`

## ✅ Solução Implementada

### 1. Atualização do Banco de Dados

**Arquivo criado:** `atualizar-constraint-curso-profissionalizante.sql`

Este script SQL atualiza o constraint da tabela `inscricoes` para aceitar o novo valor:

```sql
ALTER TABLE inscricoes
ADD CONSTRAINT inscricoes_tipo_de_curso_check
CHECK (tipo_de_curso = ANY (ARRAY[
  'graduacao'::text, 
  'pos-graduacao'::text, 
  'curso-tecnico'::text,
  'curso-profissionalizante'::text  -- ✅ NOVO VALOR
]));
```

**⚠️ AÇÃO NECESSÁRIA:** Execute este script no DBGate:
- Acesse: https://banco-banco-dbgate.6tqx2r.easypanel.host/
- Vá em Query → New Query
- Cole o conteúdo do arquivo `atualizar-constraint-curso-profissionalizante.sql`
- Execute o script completo
- Verifique se o teste de inserção funcionou

### 2. Atualização do PriceModal

**Arquivo modificado:** `src/components/PriceModal.tsx`

**Mudanças realizadas:**

#### a) Detecção do tipo de curso:
```typescript
// ANTES - não detectava Profissionalizante
let tipoDeCurso = 'graduacao';
if (course.formation === 'MBA' || course.formation === 'Especialista') {
  tipoDeCurso = 'pos-graduacao';
} else if (course.formation === 'Técnico') {
  tipoDeCurso = 'curso-tecnico';
}

// DEPOIS - agora detecta Profissionalizante ✅
let tipoDeCurso = 'graduacao';
if (course.formation === 'MBA' || course.formation === 'Especialista') {
  tipoDeCurso = 'pos-graduacao';
} else if (course.formation === 'Técnico') {
  tipoDeCurso = 'curso-tecnico';
} else if (course.formation === 'Profissionalizante') {
  tipoDeCurso = 'curso-profissionalizante';  // ✅ NOVO
}
```

#### b) Detecção da página:
```typescript
// ANTES - não detectava /cursos-profissionalizantes
if (pathname.includes('/pos-mba')) {
  paginaAtual = 'pos-mba';
} else if (pathname.includes('/cursos-tecnicos')) {
  paginaAtual = 'cursos-tecnicos';
} else if (pathname.includes('/graduacao')) {
  paginaAtual = 'graduacao';
}

// DEPOIS - agora detecta /cursos-profissionalizantes ✅
if (pathname.includes('/pos-mba')) {
  paginaAtual = 'pos-mba';
} else if (pathname.includes('/cursos-tecnicos')) {
  paginaAtual = 'cursos-tecnicos';
} else if (pathname.includes('/cursos-profissionalizantes')) {
  paginaAtual = 'cursos-profissionalizantes';  // ✅ NOVO
} else if (pathname.includes('/graduacao')) {
  paginaAtual = 'graduacao';
}
```

## 🎯 Resultado Esperado

Agora, quando um usuário preencher o formulário na página de **cursos profissionalizantes**:

1. ✅ Os dados serão salvos na tabela `inscricoes`
2. ✅ Campo `tipo_de_curso` = `'curso-profissionalizante'`
3. ✅ Campo `pagina` = `'cursos-profissionalizantes'`
4. ✅ Campo `nome_curso` = Nome do curso (ex: "Marketing Digital (Agente)")
5. ✅ Webhook será enviado para o n8n com os dados

## 📊 Valores Aceitos no Campo tipo_de_curso

Após a atualização, os valores permitidos são:

| Valor | Página | Tipo de Curso |
|-------|--------|---------------|
| `graduacao` | `/graduacao` | Bacharelado, Licenciatura, Tecnólogo |
| `pos-graduacao` | `/pos-mba` | MBA, Especialização |
| `curso-tecnico` | `/cursos-tecnicos` | Cursos Técnicos |
| `curso-profissionalizante` | `/cursos-profissionalizantes` | Cursos Profissionalizantes ✅ NOVO |

## 🧪 Como Testar

1. **Execute o script SQL** (OBRIGATÓRIO)
2. **Teste no site:**
   - Acesse: `/cursos-profissionalizantes`
   - Escolha um curso (ex: "Marketing Digital")
   - Clique em "Ver Investimento"
   - Preencha: Nome, Telefone
   - Complete o reCAPTCHA
   - Clique em "Enviar"
3. **Verifique no banco:**
   - Acesse o DBGate
   - Execute: `SELECT * FROM inscricoes WHERE tipo_de_curso = 'curso-profissionalizante' ORDER BY data_de_criacao DESC LIMIT 10;`
   - Deve aparecer a inscrição com todos os dados

## 📝 Resumo dos Arquivos Modificados

- ✅ **Criado:** `atualizar-constraint-curso-profissionalizante.sql` - Script para atualizar o banco
- ✅ **Modificado:** `src/components/PriceModal.tsx` - Adicionado suporte para cursos profissionalizantes
- ✅ **Criado:** `IMPLEMENTACAO_CURSOS_PROFISSIONALIZANTES.md` - Esta documentação

## ⚠️ IMPORTANTE

**Antes de testar no site, você DEVE executar o script SQL no banco de dados!**

Caso contrário, o erro abaixo irá aparecer:
```
new row for relation "inscricoes" violates check constraint "inscricoes_tipo_de_curso_check"
```

## 🎉 Conclusão

A implementação está completa e seguiu o mesmo padrão das outras páginas (graduação, pós-MBA e cursos técnicos). Após executar o script SQL, os cursos profissionalizantes estarão funcionando perfeitamente!

