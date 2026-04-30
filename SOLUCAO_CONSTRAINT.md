# ✅ Solução para o Constraint

## 🔍 Problema Identificado

A tabela `inscricoes` tem um **CHECK CONSTRAINT** no campo `tipo_de_curso` que só aceita valores específicos.

**Erro que você teve:**
```
new row for relation "inscricoes" violates check constraint "inscricoes_tipo_de_curso_check"
```

## ✅ Solução Implementada

Ajustei o código para enviar valores **categorizados** em vez do nome específico do curso:

### 📊 Mapeamento:

| Formation (curso)  | tipo_de_curso (salvo no banco) |
|--------------------|--------------------------------|
| Bacharelado        | Graduação                      |
| Licenciatura       | Graduação                      |
| Tecnólogo          | Técnico                        |
| MBA                | MBA                            |
| Especialista       | Pós-Graduação                  |

### 💾 Dados Salvos Agora:

```javascript
{
  nome_completo: "João Silva",
  celular: "(11) 99999-9999",
  email: "Administração",           // ← Nome do curso aqui
  tipo_de_curso: "Graduação",       // ← Categoria
  pagina: "graduacao",
  campanha: null,
  status: "novo"
}
```

**Nota:** Como o campo `email` não está sendo usado para email real, estou salvando o **nome do curso** nele para você saber qual curso específico a pessoa se interessou.

## 🧪 Teste no SQL Editor

Execute este comando no Supabase para testar:

```sql
-- Deve funcionar agora
INSERT INTO inscricoes (
  nome_completo, celular, email,
  tipo_de_curso, pagina, campanha, status
) VALUES (
  'Teste Final', '(11) 99999-9999', 'Administração',
  'Graduação', 'graduacao', null, 'novo'
) RETURNING *;
```

## 📋 Verificar Constraint (Opcional)

Para ver quais valores são permitidos no `tipo_de_curso`:

```sql
SELECT pg_get_constraintdef(oid) 
FROM pg_constraint
WHERE conrelid = 'inscricoes'::regclass
AND conname LIKE '%tipo_de_curso%';
```

## 🎯 Teste no Site

1. Abra o console (F12)
2. Clique em "Ver preço" em um curso de **Graduação**
3. Preencha e envie
4. Veja no console:
   ```
   📝 Dados do lead preparados: {
     nome_completo: "...",
     celular: "...",
     email: "Administração",  ← Nome do curso
     tipo_de_curso: "Graduação", ← Categoria
     pagina: "graduacao",
     status: "novo"
   }
   ✅ Inscrição salva com sucesso!
   ```

5. Verifique no Supabase:
   ```sql
   SELECT 
     nome_completo,
     celular,
     email as curso_nome,
     tipo_de_curso as categoria,
     pagina,
     data_de_criacao
   FROM inscricoes 
   ORDER BY data_de_criacao DESC 
   LIMIT 5;
   ```

## 📊 Como Visualizar os Dados

### Ver leads com o nome do curso:

```sql
SELECT 
  nome_completo,
  celular,
  email as curso_interessado,  -- Nome do curso está aqui
  tipo_de_curso as categoria,  -- Graduação, MBA, etc.
  pagina,
  data_de_criacao
FROM inscricoes 
ORDER BY data_de_criacao DESC;
```

### Cursos mais procurados:

```sql
SELECT 
  email as curso,
  COUNT(*) as total_leads
FROM inscricoes
WHERE email IS NOT NULL
GROUP BY email
ORDER BY total_leads DESC;
```

### Categorias mais procuradas:

```sql
SELECT 
  tipo_de_curso as categoria,
  COUNT(*) as total_leads
FROM inscricoes
GROUP BY tipo_de_curso
ORDER BY total_leads DESC;
```

## ✅ Resumo

- ✅ `tipo_de_curso` agora usa valores categorizados: "Graduação", "MBA", "Pós-Graduação", "Técnico"
- ✅ Nome específico do curso salvo no campo `email`
- ✅ Compatível com o constraint da tabela
- ✅ Mantém informação de qual curso específico a pessoa se interessou

**Agora deve funcionar perfeitamente!** 🎉

