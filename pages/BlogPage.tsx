import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Clock, Eye, ArrowRight, Tag, GraduationCap, BookOpen, Loader2 } from 'lucide-react';
import { blogSupabase } from '../lib/blogSupabase';
import { type BlogPost, BLOG_CATEGORIES } from '../data/blogPosts';

function PostCard({ post, featured = false }: { post: BlogPost; featured?: boolean; key?: React.Key }) {
  const formattedDate = new Date(post.created_at).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  if (featured) {
    return (
      <Link to={`/blog/${post.slug}`}>
        <article className="group cursor-pointer bg-white overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col lg:flex-row border border-gray-100">
          <div className="lg:w-3/5 overflow-hidden relative">
            <img
              src={post.cover_image || 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg'}
              alt={post.title}
              loading="lazy"
              className="w-full h-72 lg:h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10" />
            <div className="absolute top-4 left-4">
              <span className="inline-block px-3 py-1 bg-orange-600 text-white text-xs font-bold tracking-widest uppercase">
                {post.category}
              </span>
            </div>
          </div>
          <div className="lg:w-2/5 p-8 lg:p-10 flex flex-col justify-between">
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-3">{formattedDate}</p>
              <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900 mb-4 leading-tight group-hover:text-orange-600 transition-colors">
                {post.title}
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">{post.excerpt}</p>
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-500 text-xs">
                      <Tag size={10} />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {post.author_avatar && (
                  <img src={post.author_avatar} alt={post.author_name} className="w-8 h-8 rounded-full object-cover" />
                )}
                <div>
                  <p className="text-xs font-semibold text-gray-700">{post.author_name}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                    <span className="flex items-center gap-1"><Clock size={10} />{post.read_time} min</span>
                    <span className="flex items-center gap-1"><Eye size={10} />{post.views.toLocaleString('pt-BR')}</span>
                  </div>
                </div>
              </div>
              <span className="flex items-center gap-1.5 text-xs font-bold text-orange-600 uppercase tracking-wider transition-all group-hover:gap-3">
                Ler mais <ArrowRight size={13} />
              </span>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link to={`/blog/${post.slug}`}>
      <article className="group cursor-pointer bg-white overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col border border-gray-100 h-full">
        <div className="overflow-hidden relative">
          <img
            src={post.cover_image || 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg'}
            alt={post.title}
            loading="lazy"
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute top-3 left-3">
            <span className="inline-block px-2.5 py-1 bg-orange-600 text-white text-[10px] font-bold tracking-widest uppercase">
              {post.category}
            </span>
          </div>
        </div>
        <div className="p-5 flex flex-col flex-1">
          <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide mb-2">{formattedDate}</p>
          <h2 className="text-base font-bold text-gray-900 mb-2 leading-snug group-hover:text-orange-600 transition-colors line-clamp-2">
            {post.title}
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2 flex-1">{post.excerpt}</p>
          <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
            <div className="flex items-center gap-2">
              {post.author_avatar && (
                <img src={post.author_avatar} alt={post.author_name} className="w-6 h-6 rounded-full object-cover" />
              )}
              <span className="text-xs font-medium text-gray-600">{post.author_name}</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-gray-400">
              <span className="flex items-center gap-1"><Clock size={11} />{post.read_time} min</span>
              <span className="flex items-center gap-1"><Eye size={11} />{post.views.toLocaleString('pt-BR')}</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');

  useEffect(() => {
    async function loadPosts() {
      setLoading(true);
      try {
        const { data, error: err } = await blogSupabase
          .from('blog_posts')
          .select('id,title,slug,excerpt,cover_image,author_name,author_avatar,category,tags,read_time,views,created_at')
          .eq('published', true)
          .order('created_at', { ascending: false });

        if (err) throw err;
        setPosts(data || []);
      } catch (e: any) {
        console.error('[Blog] Erro ao carregar posts:', e);
        setError('Não foi possível carregar os artigos. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    }
    loadPosts();
  }, []);

  const filtered = posts.filter((post) => {
    const matchesCategory = activeCategory === 'Todos' || post.category === activeCategory;
    const matchesSearch =
      search.trim() === '' ||
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      (post.tags || []).some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="min-h-screen pt-16">
      <section className="bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-orange-600 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-orange-600 blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-5">
              <GraduationCap size={18} className="text-orange-600" />
              <span className="text-orange-600 text-sm font-semibold tracking-widest uppercase">
                Blog Educacional
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-5 leading-tight">
              Conhecimento que<br />
              <span className="text-orange-500">transforma carreiras</span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-xl">
              Artigos, guias e materiais de estudo para concursos públicos, graduação e pós-graduação EaD.
            </p>
            <div className="relative max-w-lg">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar artigos, categorias, tags..."
                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>
        <div className="h-1 bg-gradient-to-r from-transparent via-orange-600 to-transparent" />
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-wrap gap-2 mb-10">
          {BLOG_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-sm font-medium rounded-sm transition-all ${
                activeCategory === cat
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-400 hover:text-gray-900'
              }`}
            >
              {cat}
            </button>
          ))}
          {search && (
            <div className="ml-auto flex items-center gap-2 text-sm text-gray-500">
              <BookOpen size={14} />
              <span>{filtered.length} resultado{filtered.length !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 size={36} className="animate-spin text-orange-600" />
            <p className="text-gray-500 text-sm">Carregando artigos...</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-red-500">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Search size={36} className="text-gray-300" />
            <p className="text-gray-500 text-sm">Nenhum artigo encontrado.</p>
          </div>
        )}

        {!loading && !error && featured && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-5 rounded-full bg-orange-600" />
              <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Destaque</span>
            </div>
            <PostCard post={featured} featured />
          </div>
        )}

        {!loading && !error && rest.length > 0 && (
          <>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-5 rounded-full bg-orange-600" />
              <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Artigos Recentes</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
