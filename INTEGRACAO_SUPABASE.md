# Integração com Supabase - Sistema de Preços

## ✅ Implementação Concluída

A integração com Supabase foi implementada com sucesso! Agora o sistema busca os preços reais dos cursos diretamente do banco de dados.

## 🔧 Como Configurar

### 1. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://seu-projeto-id.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
```

### 2. Configurar o Banco de Dados

1. Acesse o [Supabase](https://supabase.com)
2. Crie um novo projeto ou acesse um existente
3. Vá em **SQL Editor**
4. Execute o conteúdo do arquivo `database-schema.sql`

### 3. Configurar Políticas de Segurança

No SQL Editor do Supabase, execute:

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

## 🚀 Como Funciona

### Fluxo de Busca de Preços

1. **Usuário clica em "Ver preço"** → Abre o modal
2. **Usuário preenche os dados** → Nome, telefone, modalidade
3. **Usuário clica em "Enviar"** → Sistema busca preço no Supabase
4. **Sistema exibe o preço** → Vem do banco ou usa fallback

### Estrutura de Dados

#### Tabela `courses`
- `id`: ID único do curso
- `name`: Nome do curso
- `area`: Área do curso (Negócios, Tecnologia, etc.)
- `formation`: Tipo de formação (Bacharelado, Licenciatura, etc.)
- `modality`: Modalidades disponíveis
- `duration`: Duração do curso
- `description`: Descrição do curso

#### Tabela `course_prices`
- `id`: ID único do preço
- `course_name`: Nome do curso
- `modality`: Modalidade específica (EAD, Presencial)
- `price`: Preço da mensalidade
- `formation_type`: Tipo de formação
- `duration_months`: Duração em meses
- `special_conditions`: Condições especiais

## 🔄 Sistema de Fallback

O sistema possui um mecanismo de fallback inteligente:

- **Se encontrar no banco**: Usa o preço do Supabase
- **Se não encontrar**: Usa o preço local como fallback
- **Indicador visual**: Mostra "✓ Preço atualizado do sistema" quando vem do banco

## 📝 Exemplo de Uso

```typescript
// Buscar preço específico
const price = await CourseService.getCoursePrice('Administração', 'EAD');

// Buscar com fallback
const result = await CourseService.getCoursePriceWithFallback(
  'Administração', 
  'EAD', 
  299.90 // preço fallback
);
```

## 🛠️ Arquivos Criados/Modificados

### Novos Arquivos:
- `src/lib/supabase.ts` - Configuração do Supabase
- `src/services/courseService.ts` - Serviços para buscar dados
- `database-schema.sql` - Estrutura do banco
- `supabase-config.md` - Instruções de configuração

### Arquivos Modificados:
- `src/components/PriceModal.tsx` - Integração com Supabase
- `package.json` - Dependência @supabase/supabase-js

## 🎯 Benefícios

1. **Preços Dinâmicos**: Atualização em tempo real dos preços
2. **Flexibilidade**: Diferentes preços por modalidade
3. **Confiabilidade**: Sistema de fallback garante funcionamento
4. **Escalabilidade**: Fácil adição de novos cursos e preços
5. **Manutenibilidade**: Centralização dos dados no banco

## 🔍 Monitoramento

Para verificar se a integração está funcionando:

1. Abra o DevTools do navegador
2. Vá na aba Network
3. Clique em "Ver preço" e preencha o formulário
4. Observe as requisições para o Supabase
5. Verifique se o preço exibido corresponde ao banco

## 📞 Suporte

Se precisar de ajuda com a configuração ou tiver dúvidas sobre a implementação, consulte:

- [Documentação do Supabase](https://supabase.com/docs)
- [Guia de configuração](supabase-config.md)
- [Estrutura do banco](database-schema.sql)
