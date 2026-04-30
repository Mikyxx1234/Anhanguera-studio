# Configuração do Supabase

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Configurações do Supabase
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Como obter as credenciais:

1. Acesse [https://supabase.com](https://supabase.com)
2. Crie um novo projeto ou acesse um existente
3. Vá em **Settings > API**
4. Copie a **URL do projeto** e a **chave anônima (anon key)**

## Estrutura do Banco

Execute o arquivo `database-schema.sql` no SQL Editor do Supabase para criar as tabelas e inserir dados de exemplo.

## Tabelas Criadas:

- `courses`: Informações dos cursos
- `course_prices`: Preços por curso e modalidade

## Políticas de Segurança (RLS)

Para permitir leitura pública dos dados, execute no SQL Editor:

```sql
-- Habilitar RLS
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_prices ENABLE ROW LEVEL SECURITY;

-- Política para leitura pública
CREATE POLICY "Permitir leitura pública de cursos" ON courses
    FOR SELECT USING (true);

CREATE POLICY "Permitir leitura pública de preços" ON course_prices
    FOR SELECT USING (true);
```
