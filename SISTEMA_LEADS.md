# ✅ Sistema de Captura de Leads Implementado

## 🎯 Implementação Completa

Agora todas as inscrições feitas através do botão "Ver preço" são **automaticamente salvas no banco de dados Supabase**!

## 🚀 Como Funciona

### Fluxo de Captura:

1. **Usuário clica "Ver preço"** em um curso
2. **Preenche o formulário:**
   - Nome completo
   - Telefone (validado com DDD brasileiro)
   - Modalidade (se aplicável)
3. **Clica "Enviar"**
4. **Sistema salva automaticamente** na tabela `inscricoes`
5. **Mostra o preço** do curso

### 📊 Dados Salvos no Banco:

Cada lead salvo contém:

```typescript
{
  nome_completo: "João Silva",
  celular: "(11) 99999-9999",
  email: null,
  tipo_de_curso: "Bacharelado",
  pagina: "/graduation",
  campanha: "google_ads_2024",  // Se houver UTM
  status: "novo",
  curso_nome: "Administração",
  modalidade: "EAD",
  data_de_criacao: "2024-01-15T10:30:00Z"
}
```

## 🗄️ Estrutura do Banco

### Tabela: `inscricoes`

| Campo            | Tipo      | Descrição                           |
|------------------|-----------|-------------------------------------|
| `id`             | UUID      | ID único (gerado automaticamente)   |
| `nome_completo`  | TEXT      | Nome completo do lead               |
| `celular`        | TEXT      | Telefone com DDD                    |
| `email`          | TEXT      | Email (opcional)                    |
| `tipo_de_curso`  | TEXT      | Tipo: Bacharelado, Licenciatura, etc|
| `pagina`         | TEXT      | Página onde foi capturado           |
| `campanha`       | TEXT      | UTM campaign (se houver)            |
| `status`         | TEXT      | Status: novo, contatado, etc        |
| `curso_nome`     | TEXT      | Nome do curso                       |
| `modalidade`     | TEXT      | EAD, Presencial, etc.               |
| `data_de_criacao`| TIMESTAMP | Data/hora da inscrição              |

### View: `inscricoes_recentes`

View automática que mostra leads dos **últimos 30 dias**:
```sql
SELECT * FROM inscricoes_recentes;
```

## 🔧 Configuração Necessária

### 1. Criar a Tabela (se não existir)

Execute o arquivo `inscricoes-schema.sql` no SQL Editor do Supabase.

### 2. Configurar Políticas RLS

**IMPORTANTE:** Configure a política para permitir inserção pública:

```sql
ALTER TABLE inscricoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir inserção pública de inscrições" ON inscricoes
    FOR INSERT 
    WITH CHECK (true);
```

Isso permite que o site salve leads **sem autenticação** (necessário para captura pública).

### 3. Verificar Permissões

Certifique-se de que a chave anônima (anon key) tem permissão para inserir na tabela `inscricoes`.

## 📊 Como Visualizar os Leads

### No Supabase (Table Editor):

1. Acesse o Supabase
2. Vá em **Table Editor**
3. Selecione a tabela `inscricoes`
4. Veja todos os leads capturados

### Usando a View de Recentes:

```sql
-- Leads dos últimos 30 dias
SELECT * FROM inscricoes_recentes 
ORDER BY data_de_criacao DESC;
```

### Filtros Úteis:

```sql
-- Leads de hoje
SELECT * FROM inscricoes 
WHERE DATE(data_de_criacao) = CURRENT_DATE;

-- Leads por curso
SELECT curso_nome, COUNT(*) as total
FROM inscricoes
GROUP BY curso_nome
ORDER BY total DESC;

-- Leads por status
SELECT status, COUNT(*) as total
FROM inscricoes
GROUP BY status;

-- Leads de uma campanha específica
SELECT * FROM inscricoes
WHERE campanha = 'google_ads_2024';
```

## 🎨 Recursos Implementados

### 1. Validação de Dados
- ✅ Nome obrigatório
- ✅ Telefone com DDD brasileiro validado
- ✅ Máscara automática de telefone
- ✅ Botão desabilitado até dados válidos

### 2. Captura Inteligente
- ✅ Detecta página automaticamente
- ✅ Captura UTM campaign (se houver na URL)
- ✅ Salva curso e modalidade escolhidos
- ✅ Timestamp automático

### 3. Tratamento de Erros
- ✅ Continua funcionando mesmo se falhar ao salvar
- ✅ Logs no console para debug
- ✅ Não interrompe a experiência do usuário

### 4. Logs no Console
- ✅ **Sucesso**: "Lead salvo com sucesso!"
- ⚠️ **Warning**: "Não foi possível salvar o lead"
- ❌ **Erro**: Detalhes do erro

## 🔍 Como Testar

### Teste Rápido:

1. Acesse o site: `http://localhost:5174/graduation`
2. Clique em "Ver preço" em qualquer curso
3. Preencha:
   - Nome: "Teste Lead"
   - Telefone: "(11) 99999-9999"
4. Clique "Enviar"
5. Abra o console (F12): Veja "✅ Lead salvo com sucesso!"
6. Verifique no Supabase: Tabela `inscricoes` → Novo registro!

### Verificar no Supabase:

```sql
-- Último lead cadastrado
SELECT * FROM inscricoes 
ORDER BY data_de_criacao DESC 
LIMIT 1;
```

## 📈 Métricas e Análises

### Dashboard Básico:

```sql
-- Total de leads
SELECT COUNT(*) as total_leads FROM inscricoes;

-- Leads por dia (últimos 7 dias)
SELECT 
  DATE(data_de_criacao) as dia,
  COUNT(*) as total
FROM inscricoes
WHERE data_de_criacao >= NOW() - INTERVAL '7 days'
GROUP BY dia
ORDER BY dia DESC;

-- Cursos mais procurados
SELECT 
  curso_nome,
  COUNT(*) as total_leads,
  COUNT(CASE WHEN status = 'convertido' THEN 1 END) as convertidos
FROM inscricoes
GROUP BY curso_nome
ORDER BY total_leads DESC;

-- Taxa de conversão por modalidade
SELECT 
  modalidade,
  COUNT(*) as total,
  ROUND(COUNT(CASE WHEN status = 'convertido' THEN 1 END)::numeric / COUNT(*) * 100, 2) as taxa_conversao
FROM inscricoes
GROUP BY modalidade;
```

## 🔐 Segurança

### Políticas Implementadas:

1. **Inserção Pública**: ✅ Permitida (necessário para captura)
2. **Leitura**: ⚠️ Configure conforme necessário
3. **Atualização/Exclusão**: ❌ Bloqueado para anônimos

### Recomendações:

- ✅ Mantenha inserção pública
- ✅ Restrinja leitura para admin
- ✅ Bloqueie updates/deletes para anônimos
- ✅ Use RLS para proteger dados sensíveis

## 📱 Integração com CRM

Os dados podem ser facilmente integrados com:

- **Zapier**: Webhook quando novo lead
- **Make (Integromat)**: Automação de follow-up
- **Google Sheets**: Export automático
- **Email**: Notificações de novos leads

### Exemplo de Webhook:

```sql
-- Trigger para notificar novo lead
CREATE OR REPLACE FUNCTION notify_new_lead()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify('new_lead', row_to_json(NEW)::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_new_lead
  AFTER INSERT ON inscricoes
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_lead();
```

## 🎯 Próximos Passos (Opcional)

### Melhorias Futuras:

1. **Campo de Email**: Adicionar campo opcional
2. **Verificação de Duplicidade**: Alertar se telefone já cadastrado
3. **Score de Lead**: Classificar leads por qualidade
4. **Notificações**: Email automático para equipe comercial
5. **Dashboard**: Painel de analytics em tempo real
6. **Export**: Botão para exportar leads

## ✅ Status

**Sistema 100% Funcional!**

- ✅ Salva leads automaticamente
- ✅ Validação completa de dados
- ✅ Captura UTM campaigns
- ✅ Registra curso e modalidade
- ✅ Tratamento de erros
- ✅ Logs para debug
- ✅ View de leads recentes

**Todos os leads capturados através do botão "Ver preço" estão sendo salvos no Supabase!** 🎉

