-- Estrutura do banco de dados para cursos e preços
-- Execute estes comandos no seu Supabase SQL Editor

-- Tabela de cursos
CREATE TABLE IF NOT EXISTS courses (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  area VARCHAR(100) NOT NULL,
  formation VARCHAR(50) NOT NULL,
  modality VARCHAR(100) NOT NULL,
  duration VARCHAR(50) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de preços dos cursos
CREATE TABLE IF NOT EXISTS course_prices (
  id SERIAL PRIMARY KEY,
  course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
  course_name VARCHAR(255) NOT NULL,
  modality VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  formation_type VARCHAR(50) NOT NULL,
  duration_months INTEGER,
  special_conditions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(course_name, modality)
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_course_prices_course_name ON course_prices(course_name);
CREATE INDEX IF NOT EXISTS idx_course_prices_modality ON course_prices(modality);
CREATE INDEX IF NOT EXISTS idx_courses_name ON courses(name);

-- Inserir dados de exemplo (você pode ajustar conforme seus dados reais)
INSERT INTO courses (name, area, formation, modality, duration, description) VALUES
('Administração', 'Negócios', 'Bacharelado', 'EAD/Presencial', '4 anos', 'Se você se imagina trabalhando em grandes empresas, em funções executivas e com uma visão ampla dos negócios, a graduação em Administração é uma boa opção.'),
('Marketing', 'Negócios', 'Bacharelado', 'EAD/Presencial', '4 anos', 'Domine as estratégias do marketing digital e tradicional'),
('Engenharia Civil', 'Engenharia', 'Bacharelado', 'Presencial', '5 anos', 'Construa o futuro com conhecimento técnico sólido'),
('Sistemas de Informação', 'Tecnologia', 'Bacharelado', 'EAD/Presencial', '4 anos', 'Desenvolva soluções tecnológicas inovadoras'),
('Enfermagem', 'Saúde', 'Bacharelado', 'Presencial', '5 anos', 'Cuide vidas com formação humanizada e técnica'),
('Psicologia', 'Saúde', 'Bacharelado', 'Presencial', '5 anos', 'Compreenda a mente humana e transforme vidas'),
('Direito', 'Humanas', 'Bacharelado', 'Presencial', '5 anos', 'Defenda a justiça com formação jurídica completa'),
('Pedagogia', 'Humanas', 'Licenciatura', 'EAD/Presencial', '4 anos', 'Forme o futuro através da educação')
ON CONFLICT (name) DO NOTHING;

-- Inserir preços de exemplo (ajuste conforme seus preços reais)
INSERT INTO course_prices (course_name, modality, price, formation_type, duration_months, special_conditions) VALUES
('Administração', 'EAD', 299.90, 'Bacharelado', 48, 'Condições especiais aplicáveis'),
('Administração', 'Presencial', 399.90, 'Bacharelado', 48, 'Condições especiais aplicáveis'),
('Marketing', 'EAD', 279.90, 'Bacharelado', 48, 'Condições especiais aplicáveis'),
('Marketing', 'Presencial', 379.90, 'Bacharelado', 48, 'Condições especiais aplicáveis'),
('Engenharia Civil', 'Presencial', 599.90, 'Bacharelado', 60, 'Condições especiais aplicáveis'),
('Sistemas de Informação', 'EAD', 349.90, 'Bacharelado', 48, 'Condições especiais aplicáveis'),
('Sistemas de Informação', 'Presencial', 449.90, 'Bacharelado', 48, 'Condições especiais aplicáveis'),
('Enfermagem', 'Presencial', 899.90, 'Bacharelado', 60, 'Condições especiais aplicáveis'),
('Psicologia', 'Presencial', 799.90, 'Bacharelado', 60, 'Condições especiais aplicáveis'),
('Direito', 'Presencial', 699.90, 'Bacharelado', 60, 'Condições especiais aplicáveis'),
('Pedagogia', 'EAD', 249.90, 'Licenciatura', 48, 'Condições especiais aplicáveis'),
('Pedagogia', 'Presencial', 349.90, 'Licenciatura', 48, 'Condições especiais aplicáveis')
ON CONFLICT (course_name, modality) DO UPDATE SET
  price = EXCLUDED.price,
  special_conditions = EXCLUDED.special_conditions,
  updated_at = NOW();

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_prices_updated_at BEFORE UPDATE ON course_prices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
