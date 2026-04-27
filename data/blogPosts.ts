export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  author_name: string;
  author_avatar: string;
  category: string;
  tags: string[];
  read_time: number;
  views: number;
  created_at: string;
}

export const BLOG_CATEGORIES = [
  'Todos',
  'Administração',
  'Concursos',
  'Direito',
  'Gestão',
  'Tecnologia',
  'Educação',
  'Geral',
];

export const fakeBlogPosts: BlogPost[] = [];
