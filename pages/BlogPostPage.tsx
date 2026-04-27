import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Eye, Tag, Share2, Calendar, BookOpen, Loader2, ImageOff } from 'lucide-react';
import { blogSupabase } from '../lib/blogSupabase';
import { renderBlogMarkdown, BLOG_CONTENT_CLASS, installBrokenImageFallback } from '../utils/markdown';
import { type BlogPost } from '../data/blogPosts';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [coverFailed, setCoverFailed] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadPost() {
      setLoading(true);
      try {
        const { data, error: err } = await blogSupabase
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .eq('published', true)
          .limit(1)
          .single();

        if (err) throw err;
        setPost(data);
      } catch (e: any) {
        console.error('[Blog] Erro ao carregar post:', e);
        setError('Não foi possível carregar o artigo.');
      } finally {
        setLoading(false);
      }
    }
    loadPost();
  }, [slug]);

  useEffect(() => {
    if (post) installBrokenImageFallback(contentRef.current);
  }, [post]);

  const handleShare = async () => {
    if (navigator.share && post) {
      await navigator.share({ title: post.title, text: post.excerpt, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex flex-col items-center justify-center gap-4">
        <Loader2 size={40} className="animate-spin text-orange-600" />
        <p className="text-gray-500 text-sm">Carregando artigo...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex flex-col items-center justify-center gap-6">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Artigo não encontrado</h2>
          <p className="text-gray-500 text-sm mb-6">Este artigo não existe ou foi removido.</p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-600 text-white text-sm font-semibold"
          >
            <ArrowLeft size={16} />
            Voltar ao blog
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(post.created_at).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft size={15} />
            Voltar ao blog
          </Link>

          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-block px-3 py-1 bg-orange-600 text-white text-xs font-bold tracking-widest uppercase">
                {post.category}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-5">
              {post.title}
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">{post.excerpt}</p>

            <div className="flex flex-wrap items-center gap-5 text-sm">
              <div className="flex items-center gap-2.5">
                {post.author_avatar && (
                  <img
                    src={post.author_avatar}
                    alt={post.author_name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-white/20"
                  />
                )}
                <div>
                  <p className="font-semibold text-white text-sm">{post.author_name}</p>
                  <p className="text-xs text-gray-500">Autor</p>
                </div>
              </div>
              <div className="h-8 w-px bg-white/10 hidden sm:block" />
              <div className="flex items-center gap-1 text-gray-400 text-xs">
                <Calendar size={13} />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-400 text-xs">
                <Clock size={13} />
                <span>{post.read_time} min de leitura</span>
              </div>
              <div className="flex items-center gap-1 text-gray-400 text-xs">
                <Eye size={13} />
                <span>{post.views.toLocaleString('pt-BR')} visualizações</span>
              </div>
              <button
                onClick={handleShare}
                className="ml-auto flex items-center gap-1.5 px-3 py-2 border border-white/20 text-gray-400 hover:text-white hover:border-white/40 text-xs transition-colors"
              >
                <Share2 size={13} />
                Compartilhar
              </button>
            </div>
          </div>
        </div>
        <div className="h-0.5 bg-gradient-to-r from-transparent via-orange-600 to-transparent" />
      </div>

      {post.cover_image && !coverFailed && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="aspect-video max-h-[500px] overflow-hidden shadow-lg bg-gray-100">
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-full object-cover"
              onError={() => setCoverFailed(true)}
            />
          </div>
        </div>
      )}
      {post.cover_image && coverFailed && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="aspect-video max-h-[500px] flex flex-col items-center justify-center gap-2 bg-gray-50 border-2 border-dashed border-gray-200 text-gray-400">
            <ImageOff size={40} />
            <span className="text-sm">Imagem de capa não disponível</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          <article className="flex-1 min-w-0 bg-white shadow-sm border border-gray-100 p-8 lg:p-12">
            <div
              ref={contentRef}
              className={BLOG_CONTENT_CLASS}
              dangerouslySetInnerHTML={{ __html: renderBlogMarkdown(post.content) }}
            />

            {post.tags && post.tags.length > 0 && (
              <div className="mt-10 pt-8 border-t border-gray-100">
                <h3 className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-600 text-sm hover:bg-orange-50 transition-colors"
                    >
                      <Tag size={11} />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </article>

          <aside className="lg:w-72 flex-shrink-0">
            <div className="sticky top-24 space-y-4">
              <div className="bg-white shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-1 h-4 rounded-full bg-orange-600" />
                  <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Sobre o Autor</h3>
                </div>
                <div className="flex flex-col items-center text-center">
                  {post.author_avatar && (
                    <img
                      src={post.author_avatar}
                      alt={post.author_name}
                      className="w-20 h-20 rounded-full object-cover mb-4 ring-4 ring-gray-100"
                    />
                  )}
                  <p className="font-bold text-gray-900">{post.author_name}</p>
                  <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                    Especialista em conteúdo educacional e preparação para concursos públicos.
                  </p>
                </div>
              </div>

              <div className="bg-orange-600 shadow-sm border border-orange-700 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen size={15} className="text-orange-200" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Detalhes</h3>
                </div>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <dt className="text-orange-200 text-xs">Categoria</dt>
                    <dd className="font-bold text-white text-xs">{post.category}</dd>
                  </div>
                  <div className="h-px bg-orange-800/40" />
                  <div className="flex justify-between items-center">
                    <dt className="text-orange-200 text-xs">Leitura</dt>
                    <dd className="font-bold text-white text-xs">{post.read_time} min</dd>
                  </div>
                  <div className="h-px bg-orange-800/40" />
                  <div className="flex justify-between items-center">
                    <dt className="text-orange-200 text-xs">Views</dt>
                    <dd className="font-bold text-white text-xs">{post.views.toLocaleString('pt-BR')}</dd>
                  </div>
                  <div className="h-px bg-orange-800/40" />
                  <div className="flex justify-between items-center">
                    <dt className="text-orange-200 text-xs">Publicado</dt>
                    <dd className="font-bold text-white text-xs">
                      {new Date(post.created_at).toLocaleDateString('pt-BR')}
                    </dd>
                  </div>
                </dl>
              </div>

              <Link
                to="/blog"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft size={14} />
                Ver todos os artigos
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
