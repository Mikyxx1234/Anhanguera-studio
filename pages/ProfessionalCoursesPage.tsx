import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { professionalCourses, professionalCourseAreas, professionalCourseDurations } from '../data/professionalCourses';
import CourseCard from '../components/CourseCard';
import PriceModal from '../components/PriceModal';
import SEOHead from '../components/SEOHead';
import Breadcrumb from '../components/Breadcrumb';
import { useNavigate } from 'react-router-dom';

export default function ProfessionalCoursesPage() {
  const navigate = useNavigate();
  const [selectedArea, setSelectedArea] = useState('Todos');
  const [selectedDuration, setSelectedDuration] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [showPrices, setShowPrices] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const shouldShowPrices = urlParams.get('show') === 'prices';

    if (shouldShowPrices) {
      setShowPrices(true);
      window.history.replaceState({}, '', window.location.pathname);
    }

    localStorage.removeItem('showPrices');
    sessionStorage.removeItem('showPrices');
  }, []);

  const handleViewPrice = (course: any) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
  };

  const filteredCourses = professionalCourses.filter(course => {
    const matchesArea = selectedArea === 'Todos' || course.area === selectedArea;
    const matchesDuration = selectedDuration === 'Todos' || course.duration === selectedDuration;
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesArea && matchesDuration && matchesSearch;
  });

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <SEOHead
        title="Cursos Profissionalizantes EAD - Anhanguera"
        description="Encontre o curso profissionalizante ideal para sua carreira. Cursos rápidos e práticos em diversas áreas reconhecidos pelo MEC."
        path="/cursos-profissionalizantes"
        image="/banner graduacao_novo soead.png"
      />

      <Breadcrumb items={[{ label: 'Cursos Profissionalizantes' }]} />

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
            Cursos Profissionalizantes EAD
          </h1>
          <p className="text-base md:text-xl text-gray-900 max-w-2xl mx-auto">
            Qualificação profissional rápida e prática para o mercado de trabalho.
          </p>
        </div>
      </section>

      <section className="py-4 md:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-4 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">
              Busque seu curso profissionalizante
            </h2>
            <p className="text-sm md:text-base text-gray-600">
              Encontre a qualificação profissional ideal para sua carreira
            </p>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-xl shadow-md mb-4 md:mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
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

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Área</label>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 appearance-none bg-white"
                  >
                    {professionalCourseAreas.map(area => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Duração</label>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    value={selectedDuration}
                    onChange={(e) => setSelectedDuration(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 appearance-none bg-white"
                  >
                    {professionalCourseDurations.map(duration => (
                      <option key={duration} value={duration}>{duration}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4 md:mb-6 text-gray-600 text-sm md:text-base">
            Mostrando {filteredCourses.length} de {professionalCourses.length} curso{filteredCourses.length !== 1 ? 's' : ''}
            {selectedArea !== 'Todos' && ` em ${selectedArea}`}
            {selectedDuration !== 'Todos' && ` com duração de ${selectedDuration}`}
            {searchTerm && ` para "${searchTerm}"`}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onViewPrice={handleViewPrice}
                showPrices={showPrices}
              />
            ))}
          </div>

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

        <PriceModal
          isOpen={isModalOpen}
          onClose={closeModal}
          course={selectedCourse}
        />
      </section>
    </div>
  );
}
