import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Clock, GraduationCap, Star, BookOpen, Award, 
  ChevronDown, ChevronUp, Download, CheckCircle, 
  Shield, Users, Info, MessageSquare, Phone, Monitor
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { graduationCourses, postGradCourses } from '../data/courses';
import { professionalCourses } from '../data/professionalCourses';
import { technicalCourses } from '../data/technicalCourses';
import SEOHead from '../components/SEOHead';
import PriceModal from '../components/PriceModal';
import { getCourseImage, placeholderImage } from '../utils/courseImage';

// Combined interface for all courses
interface Course {
  id: number;
  name: string;
  duration: string;
  formation: string;
  modality: string;
  area: string;
  description: string;
  price: number;
  posDoSeuJeito?: boolean;
}

// Map for categories to help finding courses
const CATEGORY_MAP: Record<string, Course[]> = {
  'graduacao': graduationCourses,
  'pos-mba': postGradCourses,
  'cursos-tecnicos': technicalCourses,
  'cursos-profissionalizantes': professionalCourses
};

// Helper mock data for curriculum (grade curricular)
const getMockCurriculum = (courseName: string) => {
  return [
    {
      semester: '1º Semestre',
      subjects: [
        'Introdução à Área',
        'Lógica e Fundamentos',
        'Comunicação Profissional',
        'Ética e Cidadania',
        'Metodologia de Pesquisa'
      ]
    },
    {
      semester: '2º Semestre',
      subjects: [
        'Estratégias de Mercado',
        'Prática Profissional I',
        'Tecnologias Emergentes',
        'Gestão de Projetos',
        'Análise de Dados'
      ]
    },
    {
      semester: '3º Semestre',
      subjects: [
        'Especialização Teórica I',
        'Laboratório de Projetos',
        'Psicologia Aplicada',
        'Sustentabilidade',
        'Prática Profissional II'
      ]
    }
  ];
};

export default function CourseDetailPage() {
  const { category, id } = useParams<{ category: string; id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [activeTab, setActiveTab] = useState<'curriculum' | 'skills' | 'career'>('curriculum');
  const [openSemesters, setOpenSemesters] = useState<number[]>([0]);
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);

  useEffect(() => {
    if (category && id && CATEGORY_MAP[category]) {
      const found = CATEGORY_MAP[category].find(c => c.id === parseInt(id));
      if (found) {
        setCourse(found);
      } else {
        // Redirect to 404 if course not found
        navigate('/404');
      }
    } else {
      navigate('/404');
    }
  }, [category, id, navigate]);

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  const toggleSemester = (index: number) => {
    if (openSemesters.includes(index)) {
      setOpenSemesters(openSemesters.filter(i => i !== index));
    } else {
      setOpenSemesters([...openSemesters, index]);
    }
  };

  const curriculum = getMockCurriculum(course.name);

  return (
    <div className="bg-white min-h-screen pt-16 pb-12">
      <SEOHead 
        title={`${course.name} - ${course.formation} | Anhanguera`}
        description={course.description}
        path={`/curso/${category}/${id}`}
      />

      {/* Hero Section with Image Background */}
      <section className="relative bg-[#0a0f1d] lg:bg-white lg:border-b lg:border-gray-100 overflow-hidden">
        {/* Mobile Version Background */}
        <div className="lg:hidden absolute inset-0">
          <img 
            src={getCourseImage(course)}
            alt={course.name}
            onError={(e) => {
              const fb = placeholderImage(`${course.id}-${course.name}`, 1600, 900);
              if (e.currentTarget.src !== fb) e.currentTarget.src = fb;
            }}
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1d] via-transparent to-[#0a0f1d]/50"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 lg:pt-10 lg:pb-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Content */}
            <div className="lg:col-span-8">
              {/* Navigation and Breadcrumbs (Desktop Only) */}
              <div className="hidden lg:flex flex-col gap-6 mb-8">
                <button 
                  onClick={() => navigate(-1)}
                  className="flex items-center text-gray-500 hover:text-orange-600 transition-colors group w-fit"
                >
                  <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                  <span className="font-bold text-xs uppercase tracking-widest">Voltar ao catálogo</span>
                </button>

                <div className="flex flex-wrap items-center gap-3">
                  <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border border-blue-100">
                    {category === 'graduacao' ? 'Graduação' : category === 'pos-mba' ? 'Pós-Graduação' : 'Curso'}
                  </span>
                  <span className="bg-orange-50 text-orange-700 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border border-orange-100">
                    {course.area}
                  </span>
                  <span className="bg-yellow-500 text-black px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider">
                    Top 1
                  </span>
                </div>
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white lg:text-gray-900 leading-[1.1] mb-0 lg:mb-8 tracking-tight">
                {course.name}
              </h1>

              {/* Description (Desktop Only) */}
              <p className="hidden lg:block lg:text-gray-600 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl font-medium">
                {course.description} O curso de {course.name} da Anhanguera prepara você para os desafios reais do mercado, com foco em empregabilidade e inovação.
              </p>

              {/* Quick Specs (Desktop Only) */}
              <div className="hidden lg:flex flex-wrap items-center gap-8 lg:text-gray-700">
                <div className="flex items-center gap-2 text-sm font-bold">
                  <Clock className="w-5 h-5 text-orange-500" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-bold">
                  <Award className="w-5 h-5 text-orange-500" />
                  <span>Diploma reconhecido pelo MEC</span>
                </div>
              </div>
            </div>

            {/* Right Card (Desktop Only) */}
            <div className="hidden lg:block lg:col-span-4 translate-y-8">
              <div className="bg-[#161d2f] lg:bg-white rounded-3xl overflow-hidden border border-white/5 lg:border-gray-200 shadow-2xl lg:shadow-orange-500/10">
                <div className="aspect-video w-full overflow-hidden">
                  <img 
                    src={getCourseImage(course)}
                    alt={course.name}
                    onError={(e) => {
                      const fb = placeholderImage(`${course.id}-${course.name}`, 800, 450);
                      if (e.currentTarget.src !== fb) e.currentTarget.src = fb;
                    }}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="p-8">
                  <div className="space-y-4">
                    <button 
                      onClick={() => setIsPriceModalOpen(true)}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl font-black text-sm uppercase tracking-wider transition-all shadow-lg shadow-orange-500/20 active:scale-[0.98]"
                    >
                      Ver preço
                    </button>
                    
                    <button 
                      onClick={() => window.open('https://api.whatsapp.com/send?phone=5511992793249', '_blank')}
                      className="w-full bg-transparent lg:bg-white border border-white/10 lg:border-gray-200 hover:border-white/20 lg:hover:border-gray-300 text-white lg:text-gray-700 py-4 rounded-xl font-black text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4 text-yellow-400 lg:text-orange-600" />
                      Falar com Consultor
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info Pills Section (Mobile Only) */}
      <div className="lg:hidden bg-white border-b border-gray-100 py-6 md:py-8 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-wrap gap-3">
          <div className="flex items-center gap-2.5 bg-gray-50/50 px-5 py-3 rounded-full border border-gray-100">
            <GraduationCap className="w-4 h-4 text-orange-600" />
            <span className="text-[11px] font-black text-gray-700 uppercase tracking-wide">{course.formation}</span>
          </div>
          <div className="flex items-center gap-2.5 bg-gray-50/50 px-5 py-3 rounded-full border border-gray-100">
            <Clock className="w-4 h-4 text-orange-600" />
            <span className="text-[11px] font-black text-gray-700 uppercase tracking-wide">{course.duration}</span>
          </div>
          <div className="flex items-center gap-2.5 bg-gray-50/50 px-5 py-3 rounded-full border border-gray-100">
            <Monitor className="w-4 h-4 text-orange-600" />
            <span className="text-[11px] font-black text-gray-700 uppercase tracking-wide">{course.modality}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-12 lg:mt-6 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Content Column */}
          <div className="lg:col-span-8 space-y-12 lg:space-y-8">
            
            {/* About Section (Mobile only as per user request to remove 'sobre o curso' on desktop) */}
            <div className="lg:hidden bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-2 h-8 bg-orange-500 rounded-full"></div>
                Sobre o curso
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed font-medium">
                {course.description} O curso de {course.name} da Anhanguera prepara você para os desafios reais do mercado, com foco em empregabilidade e inovação, utilizando metodologias modernas e professores experientes.
              </p>
            </div>


            {/* Mobile Ver Preço Button (Visible only on mobile) */}
            <div className="block md:hidden px-4 mb-8">
              <button 
                onClick={() => setIsPriceModalOpen(true)}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl font-black text-lg transition-all shadow-lg shadow-orange-500/20 active:scale-[0.98]"
              >
                Ver preço agora
              </button>
            </div>

            {/* Tabs Section */}
            <div className="space-y-6">
              <div className="flex flex-wrap gap-4 border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('curriculum')}
                  className={`pb-4 px-2 font-bold text-sm md:text-base border-b-2 transition-all ${
                    activeTab === 'curriculum' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <BookOpen className="inline-block w-5 h-5 mr-2 mb-1" />
                  Grade Curricular
                </button>
                <button
                  onClick={() => setActiveTab('skills')}
                  className={`pb-4 px-2 font-bold text-sm md:text-base border-b-2 transition-all ${
                    activeTab === 'skills' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Award className="inline-block w-5 h-5 mr-2 mb-1" />
                  Habilidades
                </button>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-sm min-h-[400px]">
                <AnimatePresence mode="wait">
                  {activeTab === 'curriculum' && (
                    <motion.div
                      key="curriculum"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold text-gray-900">Grade Curricular</h3>
                        <span className="text-sm font-medium text-gray-500">{curriculum.length} Semestres</span>
                      </div>
                      
                      <div className="space-y-3">
                        {curriculum.map((sem, idx) => (
                          <div 
                            key={idx}
                            className="border border-gray-100 rounded-2xl overflow-hidden"
                          >
                            <button
                              onClick={() => toggleSemester(idx)}
                              className="w-full flex items-center justify-between p-5 bg-gray-50 hover:bg-white transition-colors"
                            >
                              <span className="font-bold text-gray-900">{sem.semester}</span>
                              <div className="flex items-center">
                                <span className="text-xs text-gray-500 mr-4">{sem.subjects.length} disciplinas</span>
                                {openSemesters.includes(idx) ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                              </div>
                            </button>
                            
                            {openSemesters.includes(idx) && (
                              <motion.div 
                                initial={{ height: 0 }}
                                animate={{ height: 'auto' }}
                                className="bg-white border-t border-gray-100 p-5 pt-2"
                              >
                                <ul className="space-y-3">
                                  {sem.subjects.map((sub, sIdx) => (
                                    <li key={sIdx} className="flex items-center text-gray-600 text-sm">
                                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                                      {sub}
                                    </li>
                                  ))}
                                </ul>
                              </motion.div>
                            )}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'skills' && (
                    <motion.div
                      key="skills"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6"
                    >
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">Habilidades Desenvolvidas</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          "Pensamento Analítico e Resolução de Problemas",
                          "Liderança e Gestão de Equipes",
                          "Comunicação Eficaz e Oratória",
                          "Gestão de Tempo e Produtividade",
                          "Inteligência Emocional no Trabalho",
                          "Visão Estratégica de Negócios"
                        ].map((skill, i) => (
                          <div key={i} className="flex p-4 bg-orange-50 rounded-2xl border border-orange-100 items-start">
                            <CheckCircle className="w-5 h-5 text-orange-600 mt-1 mr-3 flex-shrink-0" />
                            <p className="font-medium text-gray-800">{skill}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* CTA Section Bottom */}
            <div className="bg-gradient-to-br from-blue-900 to-blue-950 rounded-3xl p-8 text-white relative overflow-hidden">
               <div className="relative z-10 md:flex items-center justify-between gap-8">
                  <div className="mb-6 md:mb-0">
                    <h3 className="text-3xl font-extrabold mb-4">Pronto para começar?</h3>
                    <p className="text-blue-100 max-w-md opacity-90 leading-relaxed">
                      Transforme seu futuro profissional hoje mesmo com a qualidade Anhanguera. Matricule-se e comece a estudar.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
                    <button 
                      onClick={() => setIsPriceModalOpen(true)}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-xl shadow-orange-950/20"
                    >
                      Ver preço
                    </button>
                    <button 
                      onClick={() => window.open('https://api.whatsapp.com/send?phone=5511992793249', '_blank')}
                      className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2"
                    >
                       <Phone className="w-5 h-5" /> Falar com Consultor
                    </button>
                  </div>
               </div>
               {/* Background Decorative Circles */}
               <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl"></div>
               <div className="absolute top-12 -left-12 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl"></div>
            </div>
          </div>

          {/* Right Sidebar - Info Table (Desktop Only) */}
          <div className="hidden lg:block lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl lg:shadow-orange-500/5">
              <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                <Users className="w-6 h-6 text-orange-500" />
                Informações do Curso
              </h3>
              
              <div className="space-y-6">
                {[
                  { label: 'Modalidade', value: '100% Online (EAD)' },
                  { label: 'Duração', value: course.duration },
                  { label: 'Nível', value: course.formation },
                  { label: 'Área', value: course.area },
                  { label: 'Avaliação MEC', value: 'Nota 5 (máxima)', valueColor: 'text-yellow-600' }
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-xs font-bold py-2 border-b border-gray-50 last:border-0">
                    <span className="text-gray-500 uppercase tracking-wider">{item.label}</span>
                    <span className={`${item.valueColor || 'text-gray-900'} text-right`}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Price Modal */}
      {isPriceModalOpen && (
        <PriceModal 
          isOpen={isPriceModalOpen}
          onClose={() => setIsPriceModalOpen(false)}
          course={course}
        />
      )}
    </div>
  );
}
