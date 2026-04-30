/**
 * Helpers para selecionar imagens de cursos.
 *
 * A API hoje nao retorna URL de imagem por curso, entao usamos um
 * mapa por area como primeira tentativa e o picsum.photos como
 * fallback final (servico de placeholder confiavel).
 */

const AREA_IMAGES: { keywords: string[]; url: string }[] = [
  { keywords: ['negocio', 'administracao', 'gestao', 'financ', 'contab', 'rh', 'recursos humanos', 'logistic'], url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800' },
  { keywords: ['comunicacao', 'design', 'marketing', 'public', 'jornalism', 'audiovisual', 'midia'], url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800' },
  { keywords: ['tecnologia', 'tech', 'sistemas', 'computa', 'software', 'dados', 'analise', 'desenvolvimento', 'redes'], url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800' },
  { keywords: ['direito', 'juridic'], url: 'https://images.unsplash.com/photo-1589829545856-d10d14912239?auto=format&fit=crop&q=80&w=800' },
  { keywords: ['educacao', 'pedagog', 'licenciatura', 'docencia', 'ensino', 'letras', 'historia', 'geografia', 'filosofia', 'matematica', 'fisica', 'quimica', 'biologia', 'sociologia'], url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800' },
  { keywords: ['gastronom', 'culin', 'alimento', 'cozinh', 'nutri'], url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=800' },
  { keywords: ['saude', 'enfermag', 'medic', 'farmac', 'fisiotera', 'odonto', 'psicol', 'estetic', 'radiolog'], url: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=800' },
  { keywords: ['engenharia', 'arquitetura', 'construcao', 'civil', 'eletrica', 'mecanic', 'producao'], url: 'https://images.unsplash.com/photo-1503387762-592dee58c16b?auto=format&fit=crop&q=80&w=800' },
];

const DEFAULT_AREA_IMAGE = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800';

const normalize = (s: string): string =>
  (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

export function pickImageByArea(area: string): string {
  const a = normalize(area);
  const match = AREA_IMAGES.find(m => m.keywords.some(k => a.includes(k)));
  return match ? match.url : DEFAULT_AREA_IMAGE;
}

/**
 * URL de placeholder garantido (picsum). Determinístico pelo seed,
 * então cada curso recebe sempre a mesma imagem.
 */
export function placeholderImage(seed: string | number, w: number = 800, h: number = 450): string {
  const safeSeed = encodeURIComponent(String(seed));
  return `https://picsum.photos/seed/${safeSeed}/${w}/${h}`;
}

interface CourseLike {
  id?: number | string;
  name?: string;
  area?: string;
  image?: string;
}

/**
 * Resolve a URL inicial de imagem do curso. Componente deve usar
 * onError no <img> chamando placeholderImage(course.id ?? course.name)
 * para garantir que algo sempre aparece.
 */
export function getCourseImage(course: CourseLike): string {
  if (course.image) return course.image;
  if (course.area) return pickImageByArea(course.area);
  return placeholderImage(course.id ?? course.name ?? 'curso');
}
