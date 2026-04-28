import React, { useState, useEffect } from 'react';
import { Search, Filter, GraduationCap } from 'lucide-react';
import { postGradCourses as fallbackCourses, courseAreas as fallbackAreas } from '../data/courses';
import CourseCard from '../components/CourseCard';
import PriceModal from '../components/PriceModal';
import SEOHead from '../components/SEOHead';
import Breadcrumb from '../components/Breadcrumb';
import { useNavigate } from 'react-router-dom';
import { CourseService } from '../services/courseService';

export default function PosMBAPage() {
  const navigate = useNavigate();
  const [selectedArea, setSelectedArea] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCourses, setVisibleCourses] = useState(9);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Estados para dados do banco
  const [postGradCourses, setPostGradCourses] = useState<any[]>([]);
  const [courseAreas, setCourseAreas] = useState<string[]>(fallbackAreas);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  
  // Estado para controlar exibição de preços
  const [showPrices, setShowPrices] = useState(false);

  // Detectar parâmetro ?show=prices na URL (uma única vez)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const shouldShowPrices = urlParams.get('show') === 'prices';
    
    if (shouldShowPrices) {
      setShowPrices(true);
      // Limpar o parâmetro da URL
      window.history.replaceState({}, '', window.location.pathname);
    }
    
    // Limpar storages antigos
    localStorage.removeItem('showPrices');
    sessionStorage.removeItem('showPrices');
  }, []);

  // Carregar cursos do banco ao montar o componente
  useEffect(() => {
    // Sempre mostrar cursos fallback primeiro (carregamento instantâneo)
    setPostGradCourses(fallbackCourses);
    
    const loadCourses = async () => {
      setIsLoading(true);
      setLoadError(false);
      
      try {
        // Tentar buscar cursos do banco
        const courses = await CourseService.getAllPostGradCourses();
        
        if (courses && courses.length > 0) {
          console.log('✅ Cursos Pós carregados do banco:', courses.length);
          setPostGradCourses(courses);
        } else {
          // Manter fallback se banco não retornar nada
          console.warn('⚠️ Usando cursos Pós fallback');
          setLoadError(true);
        }
        
        // Buscar áreas disponíveis
        const areas = await CourseService.getPostGradAreas();
        if (areas && areas.length > 1) {
          setCourseAreas(areas);
        }
      } catch (error) {
        console.error('❌ Erro ao carregar cursos Pós do banco:', error);
        // Manter fallback em caso de erro
        setLoadError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadCourses();
  }, []);

  const handleViewPrice = (course: any) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
  };

  const filteredCourses = postGradCourses.filter(course => {
    const matchesArea = selectedArea === 'Todos' || course.area === selectedArea;
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesArea && matchesSearch;
  });

  const coursesToShow = filteredCourses.slice(0, visibleCourses);
  const hasMoreCourses = filteredCourses.length > visibleCourses;

  const loadMoreCourses = () => {
    setVisibleCourses(prev => prev + 9);
  };

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <SEOHead
        title="Pós-Graduação 100% EAD - Anhanguera"
        description="Pós-graduação sob medida: 100% EAD, com prazos flexíveis. Especialize-se em 4, 6 ou 10 meses com certificação reconhecida pelo MEC."
        path="/pos-mba"
        image="/banner graduacao_novo soead.png"
      />
      
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'Pós-Graduação' }]} />
      
      {/* Header */}
      <section 
        className="relative py-8 md:py-24 bg-orange-50 md:bg-transparent"
        style={{
          backgroundImage: `url('https://www.soead.com.br/banner%20graduacao_novo%20soead.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <style jsx>{`
          @media (max-width: 768px) {
            section {
              background-image: none !important;
            }
          }
        `}</style>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <h1 className="text-2xl md:text-6xl font-bold text-orange-500">
              Pós-Graduação Em Dobro
            </h1>
          </div>
          <p className="text-base md:text-2xl font-bold text-gray-900 max-w-2xl mx-auto">
            Compre 1, ganhe outra!
          </p>
        </div>
      </section>

      {/* Cards flutuando sobre o banner */}
      <section className="relative -mt-8 md:-mt-20 z-10 pb-6 md:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop Grid */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-3xl mx-auto">
            {/* Card 10 meses */}
            <div className="bg-green-50 rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 p-4 border border-green-200 transform hover:-translate-y-2 h-48">
              <div className="text-center mb-4">
                <div className="text-2xl font-bold text-green-600 mb-1">10 meses</div>
                <div className="text-base font-semibold text-gray-900 mb-2">Padrão</div>
              </div>
              <p className="text-center text-gray-700 leading-relaxed text-sm">
              Ideal para quem precisa de mais flexibilidade para conciliar estudos, trabalho e vida pessoal.
              </p>
            </div>
            
            {/* Card 6 meses */}
            <div className="bg-yellow-50 rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 p-4 border border-yellow-200 transform hover:-translate-y-2 h-48">
              <div className="text-center mb-4">
                <div className="text-2xl font-bold text-yellow-600 mb-1">6 meses</div>
                <div className="text-base font-semibold text-gray-900 mb-2">Intensivo</div>
              </div>
              <p className="text-center text-gray-700 leading-relaxed text-sm">
               Perfeito para quem quer agilidade, mas com mais equilíbrio entre rotina e aprendizado.
              </p>
            </div>
          </div>

          {/* Mobile Carousel */}
          <div className="md:hidden mb-3">
            <div className="flex overflow-x-auto space-x-3 pb-4 snap-x snap-mandatory scrollbar-hide justify-center">
              {/* Card 10 meses */}
              <div className="flex-none w-64 bg-green-50 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-3 border border-green-200 snap-start h-32 relative">
                <div className="text-center mb-2">
                  <div className="text-lg font-bold text-green-600 mb-1">10 meses</div>
                  <div className="text-sm font-semibold text-gray-900 mb-1">Padrão</div>
                </div>
                <p className="text-center text-gray-700 leading-tight text-xs">
                  Ideal para quem precisa de mais flexibilidade para conciliar estudos, trabalho e vida pessoal.
                </p>
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              
              {/* Card 6 meses */}
              <div className="flex-none w-64 bg-yellow-50 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-3 border border-yellow-200 snap-start h-32 relative">
                <div className="text-center mb-2">
                  <div className="text-lg font-bold text-yellow-600 mb-1">6 meses</div>
                  <div className="text-sm font-semibold text-gray-900 mb-1">Intensivo</div>
                </div>
                <p className="text-center text-gray-700 leading-tight text-xs">
                  Perfeito para quem quer agilidade, mas com mais equilíbrio entre rotina e aprendizado.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-2 md:py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Título da Busca */}
          <div className="text-center mb-3 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">
              Busque seu curso
            </h2>
            <p className="text-sm md:text-base text-gray-600">
              Encontre a especialização ideal para sua carreira
            </p>
          </div>

          {/* Filtros */}
          <div className="bg-white p-3 md:p-6 rounded-xl shadow-md mb-3 md:mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              {/* Busca */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Buscar Especialização</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Buscar especialização..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>

              {/* Filtro por Área */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Área</label>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 appearance-none bg-white"
                  >
                    {courseAreas.map(area => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Resultados */}
          <div className="mb-3 md:mb-6 text-gray-600 text-sm md:text-base">
            Mostrando {filteredCourses.length} curso{filteredCourses.length !== 1 ? 's' : ''}
            {selectedArea !== 'Todos' && ` em ${selectedArea}`}
            {searchTerm && ` para "${searchTerm}"`}
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-10 bg-gray-200 rounded mt-4"></div>
                </div>
              ))}
            </div>
          ) : (
            /* Grid de Cursos */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
              {coursesToShow.map((course) => (
                <CourseCard 
                  key={course.id} 
                  course={course} 
                  onViewPrice={handleViewPrice}
                  showPrices={showPrices}
                />
              ))}
            </div>
          )}

          {/* Botão Ver Mais */}
          {hasMoreCourses && (
            <div className="text-center mt-4 md:mt-12">
              <button
                onClick={loadMoreCourses}
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-2 md:py-3 px-6 md:px-8 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg text-sm md:text-base"
              >
                Ver mais cursos
              </button>
            </div>
          )}

          {filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                <Search className="w-12 h-12 mx-auto mb-4" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Nenhum curso encontrado
              </h3>
              <p className="text-gray-600">
                Tente ajustar os filtros ou entre em contato conosco para mais opções
              </p>
              <button
                onClick={() => navigate('/precos-form')}
                className="mt-6 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-all duration-300"
              >
                Fale Conosco
              </button>
            </div>
          )}
        </div>

        {/* Modal de Preço */}
        <PriceModal 
          isOpen={isModalOpen}
          onClose={closeModal}
          course={selectedCourse}
        />
      </section>
    </div>
  );
}