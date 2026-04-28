import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { graduationCourses as fallbackCourses, courseAreas as fallbackAreas } from '../data/courses';
import CourseCard from '../components/CourseCard';
import PriceModal from '../components/PriceModal';
import SEOHead from '../components/SEOHead';
import Breadcrumb from '../components/Breadcrumb';
import { CourseService } from '../services/courseService';

import { useNavigate } from 'react-router-dom';

export default function GraduationPage() {
  const navigate = useNavigate();
  const [selectedArea, setSelectedArea] = useState('Todos');
  const [selectedModality, setSelectedModality] = useState('Todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCourses, setVisibleCourses] = useState(9);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Estados para dados do banco
  const [graduationCourses, setGraduationCourses] = useState<any[]>([]);
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
    setGraduationCourses(fallbackCourses);
    
    const loadCourses = async () => {
      setIsLoading(true);
      setLoadError(false);
      
      try {
        // Tentar buscar cursos do banco
        const courses = await CourseService.getAllGraduationCourses();
        
        if (courses && courses.length > 0) {
          console.log('✅ Cursos carregados do banco:', courses.length);
          setGraduationCourses(courses);
        } else {
          // Manter fallback se banco não retornar nada
          console.warn('⚠️ Usando cursos fallback');
          setLoadError(true);
        }
        
        // Buscar áreas disponíveis
        const areas = await CourseService.getCourseAreas();
        if (areas && areas.length > 1) {
          setCourseAreas(areas);
        }
      } catch (error) {
        console.error('❌ Erro ao carregar cursos do banco:', error);
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

  const filteredCourses = graduationCourses.filter(course => {
    const matchesArea = selectedArea === 'Todos' || course.area === selectedArea;
    const matchesModality = selectedModality === 'Todas' || 
      course.modality.includes(selectedModality) || 
      (selectedModality === 'EAD' && course.modality.includes('EAD')) ||
      (selectedModality === 'Presencial' && course.modality.includes('Presencial')) ||
      (selectedModality === 'Semipresencial' && course.modality.includes('Semipresencial'));
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesArea && matchesModality && matchesSearch;
  });

  const coursesToShow = filteredCourses.slice(0, visibleCourses);
  const hasMoreCourses = filteredCourses.length > visibleCourses;

  const loadMoreCourses = () => {
    setVisibleCourses(prev => prev + 9);
  };

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <SEOHead
        title="Graduação EAD e Semipresencial - Anhanguera"
        description="Encontre a graduação perfeita para transformar sua carreira. Mais de 80 cursos de bacharelado, licenciatura e tecnólogo reconhecidos pelo MEC."
        path="/graduacao"
        image="/banner graduacao_novo soead.png"
      />
      
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'Graduação' }]} />
      
      {/* Header */}
      <section 
        className="relative py-8 md:py-16 bg-orange-50 md:bg-transparent"
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
          <h1 className="text-2xl md:text-5xl font-bold text-orange-500 mb-2 md:mb-4">
             Graduação EAD ou Semipresencial
          </h1>
          <p className="text-base md:text-xl text-gray-900 max-w-2xl mx-auto">
           Encontre a graduação perfeita para transformar sua carreira e conquistar seus sonhos.
          </p>
        </div>
      </section>

      <section className="py-4 md:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Título da Busca */}
          <div className="text-center mb-4 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">
              Busque seu curso
            </h2>
            <p className="text-sm md:text-base text-gray-600">
              Encontre o curso ideal para sua carreira
            </p>
          </div>

          {/* Filtros */}
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-md mb-4 md:mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              {/* Busca */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Buscar Curso</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Buscar curso..."
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

              {/* Filtro por Modalidade */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Modalidade</label>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    value={selectedModality}
                    onChange={(e) => setSelectedModality(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 appearance-none bg-white"
                  >
                    <option value="Todas">Todas</option>
                    <option value="EAD">EAD</option>
                    <option value="Semipresencial">Semipresencial</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Resultados */}
          <div className="mb-4 md:mb-6 text-gray-600 text-sm md:text-base">
            Mostrando {filteredCourses.length} curso{filteredCourses.length !== 1 ? 's' : ''}
            {selectedArea !== 'Todos' && ` em ${selectedArea}`}
            {selectedModality !== 'Todas' && ` na modalidade ${selectedModality}`}
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
            <div className="text-center mt-6 md:mt-12">
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