import { createClient } from '@supabase/supabase-js';

// Configurações do Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tufvduiaybogfhgausqj.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1ZnZkdWlheWJvZ2ZoZ2F1c3FqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwOTUyNjksImV4cCI6MjA3MjY3MTI2OX0.o-rO2rm5uYtI-NDp5amFm9gkXcToJWjuHDJFkaOtYtQ';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Tipos para os dados do banco - baseado na tabela cursos_graduacao
export interface CursoGraduacao {
  id: string;
  nome: string;
  area: string;
  tipo: 'Bacharelado' | 'Licenciatura' | 'Tecnólogo';
  duracao: string;
  modalidade: 'EAD' | 'Presencial' | 'Semipresencial' | '100% online';
  preco: number;
  descricao: string | null;
  categoria: string;
  ativo: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

// Interface para compatibilidade com o componente existente
export interface CoursePrice {
  id: string;
  course_name: string;
  modality: string;
  price: number;
  formation_type: string;
  duration: string;
  description: string | null;
  area: string;
  categoria: string;
  ativo: boolean | null;
}

export interface Course {
  id: string;
  name: string;
  area: string;
  formation: string;
  modality: string;
  duration: string;
  description: string | null;
  categoria: string;
  ativo: boolean | null;
}

// Interface para inscrições (leads)
export interface Inscricao {
  id?: string;
  nome_completo: string;
  celular: string;
  email?: string | null;
  tipo_de_curso: string;
  pagina: string;
  campanha?: string | null;
  status?: string;
  data_de_criacao?: string;
  nome_curso?: string | null;
}
