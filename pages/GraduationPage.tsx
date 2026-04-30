import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, Clock, GraduationCap, ArrowRight, ChevronUp, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { graduationCourses as fallbackCourses, courseAreas as fallbackAreas } from '../data/courses';
import GraduationCourseCard from '../components/GraduationCourseCard';
import PriceModal from '../components/PriceModal';
import SEOHead from '../components/SEOHead';
import { CourseService } from '../services/courseService';

export default function GraduationPage() {
  const [selectedArea, setSelectedArea] = useState('Todas as Areas');
  const [selectedModality, setSelectedModality] = useState('Todas as Modalidades');
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCourses, setVisibleCourses] = useState(9);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState('Mais Populares');
  const [openFilters, setOpenFilters] = useState<string[]>([]);
  
  const [graduationCourses, setGraduationCourses] = useState<any[]>(fallbackCourses);
  const [courseAreas, setCourseAreas] = useState<string[]>(['Todas as Areas', 'Negocios', 'Tecnologia', 'Saude', 'Juridico', 'Educacao']);
  const [isLoading, setIsLoading] = useState(true);

  // Toggle filter accordion
  const toggleFilter = (filter: string) => {
    setOpenFilters(prev => 
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
  };

  // Carregar dados
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const courses = await CourseService.getAllGraduationCourses();
        if (courses && courses.length > 0) setGraduationCourses(courses);
        
        const areas = await CourseService.getCourseAreas();
        if (areas && areas.length > 1) {
          setCourseAreas(['Todas as Areas', ...areas.filter(a => a !== 'Todos')]);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();

    // Abrir filtros por padrão no desktop (lg breakpoint)
    if (window.innerWidth >= 1024) {
      setOpenFilters(['area', 'modality']);
    }
  }, []);

  const handleViewPrice = (course: any) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const filteredCourses = graduationCourses.filter(course => {
    const matchesArea = selectedArea === 'Todas as Areas' || course.area === selectedArea;
    const matchesModality = selectedModality === 'Todas as Modalidades' || 
      course.modality.toLowerCase().includes(selectedModality.toLowerCase());
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesArea && matchesModality && matchesSearch;
  });

  const coursesToShow = filteredCourses.slice(0, visibleCourses);

  return (
    <div className="pt-20 min-h-screen bg-gray-50 text-gray-900 selection:bg-orange-500/30">
      <SEOHead
        title="Graduações EAD e Semipresencial | Anhanguera"
        description="Explore nossa grade completa de cursos de graduacao da Anhanguera, com diploma reconhecido pelo MEC e mensalidades que cabem no seu bolso."
        path="/graduacao"
      />

      {/* Hero Section */}
      <section className="bg-white border-b border-gray-100 py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight text-gray-900 leading-tight">
              Graduações <span className="text-orange-600 italic">EAD e Semipresencial.</span>
            </h1>
            <p className="text-sm md:text-lg text-gray-500 leading-relaxed max-w-2xl font-medium">
              Explore nossa grade completa de cursos de graduacao da Anhanguera, com diploma reconhecido pelo MEC e mensalidades que cabem no seu bolso.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 flex-shrink-0 space-y-4 md:space-y-6">
            {/* Area Filter Accordion */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <button 
                onClick={() => toggleFilter('area')}
                className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-gray-50"
              >
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-orange-600" />
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Area de Conhecimento</h3>
                </div>
                {openFilters.includes('area') ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </button>
              
              <AnimatePresence>
                {openFilters.includes('area') && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 pt-0 space-y-1">
                      {courseAreas.map((area) => (
                        <button
                          key={area}
                          onClick={() => setSelectedArea(area)}
                          className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                            selectedArea === area 
                              ? 'bg-orange-50 text-orange-600 border border-orange-100' 
                              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                          }`}
                        >
                          {area}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Modality Filter Accordion */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <button 
                onClick={() => toggleFilter('modality')}
                className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-gray-50"
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Modalidade</h3>
                </div>
                {openFilters.includes('modality') ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </button>
              
              <AnimatePresence>
                {openFilters.includes('modality') && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 pt-0 space-y-1">
                      {['Todas as Modalidades', 'EAD', 'Semipresencial'].map((modality) => (
                        <button
                          key={modality}
                          onClick={() => setSelectedModality(modality)}
                          className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                            selectedModality === modality 
                              ? 'bg-orange-50 text-orange-600 border border-orange-100' 
                              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                          }`}
                        >
                          {modality}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-grow">
            {/* Mobile Search Bar (Top of Content) */}
            <div className="mb-8 relative group">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Buscar curso por nome ou área..."
                className="w-full bg-white border border-gray-200 rounded-2xl py-4 pl-14 pr-6 focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 transition-all outline-none text-gray-900 placeholder-gray-400 font-medium shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-gray-200">
              <div className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                <span className="text-gray-900">{filteredCourses.length}</span> cursos encontrados
              </div>
              
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3 text-xs font-bold">
                  <span className="text-gray-400">Ordenar por:</span>
                  <div className="relative">
                    <select 
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-white border border-gray-200 rounded-lg px-4 py-2 pr-10 appearance-none focus:outline-none focus:border-orange-500 transition-colors cursor-pointer text-gray-700"
                    >
                      <option>Mais Populares</option>
                      <option>Menor Valor</option>
                      <option>Nome A-Z</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white h-[450px] rounded-2xl animate-pulse border border-gray-100 shadow-sm"></div>
                ))}
              </div>
            ) : filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {coursesToShow.map((course) => (
                  <GraduationCourseCard 
                    key={course.id}
                    course={course}
                    onViewPrice={handleViewPrice}
                    category="graduacao"
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200 shadow-sm">
                <p className="text-gray-400 font-bold">Nenhum curso encontrado com esses filtros.</p>
                <button 
                  onClick={() => { setSelectedArea('Todas as Areas'); setSelectedModality('Todas as Modalidades'); setSearchTerm(''); }}
                  className="mt-4 text-orange-600 text-sm font-bold hover:underline"
                >
                  Limpar todos os filtros
                </button>
              </div>
            )}

            {/* Load More */}
            {filteredCourses.length > visibleCourses && (
              <div className="mt-16 text-center">
                <button 
                  onClick={() => setVisibleCourses(prev => prev + 9)}
                  className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-10 py-4 rounded-xl font-bold transition-all shadow-sm"
                >
                  Carregar mais cursos
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      <PriceModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        course={selectedCourse}
      />
    </div>
  );
}
