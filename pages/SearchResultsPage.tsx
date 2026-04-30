import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Search, Filter, ArrowRight } from 'lucide-react';
import { graduationCourses } from '../data/courses';
import { postGradCourses } from '../data/courses';
import { technicalCourses } from '../data/technicalCourses';
import { professionalCourses } from '../data/professionalCourses';
import CourseCard from '../components/CourseCard';
import PriceModal from '../components/PriceModal';
import SEOHead from '../components/SEOHead';
import Breadcrumb from '../components/Breadcrumb';

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchTerm = searchParams.get('q') || '';
  
  const [selectedArea, setSelectedArea] = useState('Todos');
  const [selectedType, setSelectedType] = useState('Todos');
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Combine all courses with their types
  const allCourses = [
    ...graduationCourses.map(course => ({ ...course, type: 'Graduação', category: 'graduacao' })),
    ...postGradCourses.map(course => ({ ...course, type: 'Pós-Graduação', category: 'pos-mba' })),
    ...technicalCourses.map(course => ({ ...course, type: 'Curso Técnico', category: 'cursos-tecnicos' })),
    ...professionalCourses.map(course => ({ ...course, type: 'Curso Profissionalizante', category: 'cursos-profissionalizantes' }))
  ];

  // Get all unique areas
  const allAreas = ['Todos', ...Array.from(new Set(allCourses.map(course => course.area)))];
  const courseTypes = ['Todos', 'Graduação', 'Pós-Graduação', 'Curso Técnico', 'Curso Profissionalizante'];

  // Search and filter logic
  const searchResults = allCourses.filter(course => {
    const matchesSearch = searchTerm === '' || 
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.formation.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesArea = selectedArea === 'Todos' || course.area === selectedArea;
    const matchesType = selectedType === 'Todos' || course.type === selectedType;
    
    return matchesSearch && matchesArea && matchesType;
  });

  // Popular courses for suggestions
  const popularCourses = [
    graduationCourses.find(c => c.name === 'Administração'),
    graduationCourses.find(c => c.name === 'Pedagogia'),
    postGradCourses.find(c => c.name === 'MBA em Gestão Empresarial'),
    technicalCourses.find(c => c.name === 'Técnico em Marketing'),
    professionalCourses.find(c => c.name === 'Marketing Digital (Agente)'),
    professionalCourses.find(c => c.name === 'Desenvolvedor de Software')
  ].filter(Boolean).map(course => ({
    ...course,
    type: course.formation === 'MBA' || course.formation === 'Especialista' ? 'Pós-Graduação' :
          course.formation === 'Técnico' ? 'Curso Técnico' :
          course.formation === 'Profissionalizante' ? 'Curso Profissionalizante' : 'Graduação',
    category: course.formation === 'MBA' || course.formation === 'Especialista' ? 'pos-mba' :
              course.formation === 'Técnico' ? 'cursos-tecnicos' :
              course.formation === 'Profissionalizante' ? 'cursos-profissionalizantes' : 'graduacao'
  }));

  const handleViewPrice = (course: any) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
  };

  const clearSearch = () => {
    navigate('/');
  };

  const highlightSearchTerm = (text: string) => {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? 
        <mark key={index} className="bg-yellow-200 text-yellow-900 px-1 rounded">{part}</mark> : 
        part
    );
  };

  // Enhanced course card with highlighting
  const EnhancedCourseCard = ({ course, onViewPrice }: any) => (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 group">
      <div className="p-6">
        {/* Course Type Badge */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="inline-block px-3 py-1 bg-orange-100 text-orange-800 text-xs font-semibold rounded-full">
                {course.area}
              </div>
              <div className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                course.type === 'Graduação' ? 'bg-blue-100 text-blue-800' :
                course.type === 'Pós-Graduação' ? 'bg-purple-100 text-purple-800' :
                course.type === 'Curso Técnico' ? 'bg-green-100 text-green-800' :
                'bg-amber-100 text-amber-800'
              }`}>
                {course.type}
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors duration-300">
              {highlightSearchTerm(course.name)}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {highlightSearchTerm(course.description)}
            </p>
          </div>
        </div>

        {/* Course Info */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center text-gray-600 text-sm">
            <span>{course.formation === 'MBA' || course.formation === 'Especialista' ? 'Carga horária' : 'Duração'}: {course.duration}</span>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <span>Formação: {course.formation}</span>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <span>Modalidade: {course.modality}</span>
          </div>
        </div>

        {/* CTA */}
        <div className="space-y-4">
          <Link 
            to={`/curso/${course.category}/${course.id}`}
            className="inline-flex items-center text-xs font-bold text-orange-600 hover:text-orange-700 hover:underline transition-all"
          >
            Ver detalhes do curso
          </Link>
          <button
            onClick={() => onViewPrice(course)}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium py-3 px-4 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex items-center justify-center space-x-2 group"
          >
            <span>Ver preço</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <SEOHead
        title={`Resultados para "${searchTerm}" - Anhanguera`}
        description={`Encontre cursos relacionados a "${searchTerm}". ${searchResults.length} cursos encontrados.`}
        path={`/resultados?q=${searchTerm}`}
      />
      
      {/* Breadcrumb */}
      <Breadcrumb items={[
        { label: 'Resultados de Busca' },
        { label: searchTerm }
      ]} />
      
      {/* Header */}
      <section className="py-8 bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-2xl md:text-4xl font-bold mb-2">
              Resultados para: "{searchTerm}"
            </h1>
            <p className="text-lg text-orange-100">
              {searchResults.length} curso{searchResults.length !== 1 ? 's' : ''} encontrado{searchResults.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters */}
          <div className="bg-white p-6 rounded-xl shadow-md mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search Term Display */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Termo Pesquisado</label>
                <div className="px-4 py-3 bg-gray-100 rounded-lg text-gray-700 font-medium">
                  "{searchTerm}"
                </div>
              </div>

              {/* Area Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Área</label>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 appearance-none bg-white"
                  >
                    {allAreas.map(area => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Type Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Tipo de Curso</label>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 appearance-none bg-white"
                  >
                    {courseTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Clear Search */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Ações</label>
                <button
                  onClick={clearSearch}
                  className="w-full px-4 py-3 border-2 border-orange-500 text-orange-500 font-medium rounded-lg hover:bg-orange-500 hover:text-white transition-all duration-300"
                >
                  Limpar Busca
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          {searchResults.length > 0 ? (
            <>
              <div className="mb-6 text-gray-600">
                Mostrando {searchResults.length} de {allCourses.length} cursos
                {selectedArea !== 'Todos' && ` em ${selectedArea}`}
                {selectedType !== 'Todos' && ` do tipo ${selectedType}`}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {searchResults.map((course) => (
                  <EnhancedCourseCard 
                    key={`${course.category}-${course.id}`}
                    course={course} 
                    onViewPrice={handleViewPrice}
                  />
                ))}
              </div>
            </>
          ) : (
            /* No Results */
            <div className="text-center py-12">
              <div className="text-gray-500 mb-6">
                <Search className="w-16 h-16 mx-auto mb-4" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-4">
                Nenhum curso encontrado
              </h3>
              <p className="text-gray-600 mb-8">
                Não encontramos cursos para "{searchTerm}". Tente outros termos ou explore nossos cursos populares abaixo.
              </p>

              {/* Popular Courses Suggestions */}
              <div className="max-w-4xl mx-auto">
                <h4 className="text-xl font-semibold text-gray-800 mb-6">Cursos Populares</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {popularCourses.map((course) => (
                    <div key={`popular-${course.category}-${course.id}`} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                      <div className={`inline-block px-2 py-1 text-xs font-semibold rounded-full mb-2 ${
                        course.type === 'Graduação' ? 'bg-blue-100 text-blue-800' :
                        course.type === 'Pós-Graduação' ? 'bg-purple-100 text-purple-800' :
                        course.type === 'Curso Técnico' ? 'bg-green-100 text-green-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {course.type}
                      </div>
                      <h5 className="font-semibold text-gray-900 mb-2">{course.name}</h5>
                      <p className="text-sm text-gray-600 mb-3">{course.area}</p>
                      <button
                        onClick={() => handleViewPrice(course)}
                        className="w-full bg-orange-500 text-white py-2 px-3 rounded-lg hover:bg-orange-600 transition-colors duration-300 text-sm"
                      >
                        Ver Curso
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={clearSearch}
                className="mt-8 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-3 px-8 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300"
              >
                Ver Todos os Cursos
              </button>
            </div>
          )}
        </div>

        {/* Modal */}
        <PriceModal 
          isOpen={isModalOpen}
          onClose={closeModal}
          course={selectedCourse}
        />
      </section>
    </div>
  );
}