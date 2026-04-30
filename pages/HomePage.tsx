import React, { useState, useEffect } from 'react';
import CountUp from 'react-countup';
import { ArrowRight, Award, Users, BookOpen, TrendingUp, CheckCircle, Star, GraduationCap, FileText, UserCheck } from 'lucide-react';
import { graduationCourses } from '../data/courses';
import CourseCard from '../components/CourseCard';
import PriceModal from '../components/PriceModal';
import SEOHead from '../components/SEOHead';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();
  
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
  const featuredCourses = [
    {
      id: 1,
      name: "Pedagogia",
      duration: "8 semestres",
      formation: "Licenciatura",
      modality: "Semipresencial",
      area: "Educação",
      description: "Na Pedagogia, você aprende a educar com criatividade, orientar alunos e impactar gerações inteiras.",
      price: 99.99
    },
    {
      id: 2,
      name: "Administração",
      duration: "8 semestres",
      formation: "Bacharelado",
      modality: "EAD",
      area: "Negócios",
      description: "Aprenda a gerenciar empresas, liderar equipes e tomar decisões estratégicas, transformando oportunidades em resultados.",
      price: 118.99
    },
    {
      id: 3,
      name: "Recursos Humanos",
      duration: "4 semestres",
      formation: "Tecnólogo",
      modality: "EAD",
      area: "Negócios",
      description: "Implemente estratégias, organize equipes e gere produtividade e sucesso corporativo.",
      price: 118.99
    },
    {
      id: 4,
      name: "Análise e Desenvolvimento de Sistemas",
      duration: "5 semestres",
      formation: "Tecnólogo",
      modality: "EAD",
      area: "Tecnologia",
      description: "Desenvolva softwares, implemente aplicativos e crie soluções digitais que impactam negócios e conectam pessoas.",
      price: 118.99
    }
  ];
  const [selectedCourse, setSelectedCourse] = React.useState<any>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleViewPrice = (course: any) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
  };

  const advantages = [
    {
      icon: Award,
      title: "Reconhecimento do MEC",
      description: "Todos os cursos são autorizados pelo MEC, com diplomas com a mesma validade dos presenciais."
    },
    {
      icon: Star,
      title: "Flexibilidade Total",
      description: "Estude quando e onde quiser, com opções EAD e semipresenciais."
    },
    {
      icon: Users,
      title: "Plataforma Intuitiva",
      description: "Estude com uma plataforma moderna e fácil de usar."
    },
    {
      icon: BookOpen,
      title: "Suporte Acadêmico",
      description: "Conte com tutores e professores sempre prontos para te ajudar durante todo o curso."
    }
  ];

  const stats = [
    { number: "+300", label: "Cursos de ensino superior" },
    { number: "5", label: "Polos Academicos" },
    { number: "+7", label: "Anos de Experiência" },
    { number: "+5000", label: "Alunos" }
  ];

  return (
    <div className="pt-16">
      <SEOHead
        title="Anhanguera - Transforme seu Futuro"
        description="Mais de 25 anos formando profissionais de sucesso. Escolha entre mais de 80 cursos de graduação e pós-graduação reconhecidos pelo MEC. Modalidades EAD e Presencial."
        path="/"
        image="https://images.pexels.com/photos/5940721/pexels-photo-5940721.jpeg?auto=compress&cs=tinysrgb&w=1200"
      />
      
      {/* Hero Section */}
      <section className="relative min-h-[50vh] md:min-h-[70vh] flex items-center bg-orange-500">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/Bg_HeroSection_Pos_em_dobro.png')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/70 via-orange-500/40 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-20 w-full">
          <div className="max-w-3xl text-left">
            <h1 className="text-3xl md:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight">
              Pós em dobro
              <span className="block text-white">
                Compre 1 e ganhe outra!
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white mb-6 md:mb-8 leading-relaxed">
               
              Por tempo limitado, não perca essa chance! 
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-start">
              <button
                onClick={() => navigate('/pos-mba')}
                className="bg-white text-orange-500 font-bold py-4 px-8 rounded-md hover:from-orange-600 hover:to-orange-700 transform hover:scale-105 transition-all duration-300 shadow-xl flex items-center justify-center space-x-2"
              >
                <span>Escolha seu Curso</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate('/precos-form')}
                className="border-2 border-white text-white font-bold py-4 px-8 rounded-lg hover:bg-white hover:text-gray-900 transition-all duration-300 flex items-center justify-center"
              >
                Fale Conosco
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contador Section */}
      <section className="py-2 md:py-4 bg-white hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white-50 rounded-xl p-8">
            <div className="grid grid-cols-4 gap-2 md:gap-8">
            <div className="text-center group">
              <div className="text-2xl md:text-5xl font-bold text-orange-600 mb-1 md:mb-3 group-hover:scale-110 transition-all duration-500">
                +<CountUp end={300} duration={2.5} />
              </div>
              <div className="text-gray-700 font-semibold text-xs md:text-lg">
                Cursos de ensino superior
              </div>
            </div>
            <div className="text-center group">
              <div className="text-2xl md:text-5xl font-bold text-orange-600 mb-1 md:mb-3 group-hover:scale-110 transition-all duration-500">
                <CountUp end={5} duration={2.5} />
              </div>
              <div className="text-gray-700 font-semibold text-xs md:text-lg">
                Polos Acadêmicos
              </div>
            </div>
            <div className="text-center group">
              <div className="text-2xl md:text-5xl font-bold text-orange-600 mb-1 md:mb-3 group-hover:scale-110 transition-all duration-500">
                +<CountUp end={7} duration={2.5} />
              </div>
              <div className="text-gray-700 font-semibold text-xs md:text-lg">
                Anos de Experiência
              </div>
            </div>
            <div className="text-center group">
              <div className="text-2xl md:text-5xl font-bold text-orange-600 mb-1 md:mb-3 group-hover:scale-110 transition-all duration-500">
                +<CountUp end={150000} duration={2.5} separator="," />
              </div>
              <div className="text-gray-700 font-semibold text-xs md:text-lg">
                Alunos
              </div>
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* Principais Cursos */}
      <section className="py-4 md:py-8" style={{ backgroundColor: '#fcf6f0ff' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-4 md:mb-6">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">
              Principais Cursos de Graduação
            </h2>
           
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8 md:mb-12">
            {featuredCourses.map((course) => (
              <CourseCard 
                key={course.id} 
                course={course} 
                onViewPrice={handleViewPrice}
                showPrices={showPrices}
                category="graduacao"
              />
            ))}
          </div>

          {/* Mobile Carousel */}
          <div className="md:hidden mb-4">
            <div className="flex overflow-x-auto space-x-4 pb-2 snap-x snap-mandatory scrollbar-hide mb-4">
              {featuredCourses.map((course) => (
                <div key={course.id} className="flex-none w-80 snap-start">
                  <CourseCard 
                    course={course} 
                    onViewPrice={handleViewPrice}
                    showPrices={showPrices}
                    category="graduacao"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-4 md:mt-0">
            <button
              onClick={() => navigate('/graduacao')}
              className="border-2 border-orange-500 text-orange-500 font-bold py-4 px-8 rounded-lg hover:bg-orange-500 hover:text-white transition-all duration-300 shadow-lg inline-flex items-center space-x-2"
            >
              <span>Ver Todos os Cursos</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

       {/* Pague Fácil Banner */}
      <section className="py-3 md:py-4 bg-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:simpx-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-6">
            {/* Left side - Icon, Title and Text */}
            <div className="flex items-start gap-3 md:gap-6 flex-1">
              {/* Dollar Sign Icon */}
              <div className="bg-white/20 p-2 md:p-4 rounded-full flex-shrink-0">
                <svg
                  className="w-6 h-6 md:w-12 md:h-12 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
                </svg>
              </div>
              {/* Title and Text */}
              <div className="flex-1 min-w-0">
                <h2 className="text-white text-lg md:text-xl font-bold mb-1 md:mb-2">
                  Pague Fácil Anhanguera
                </h2>
                <div className="text-white text-sm md:text-base leading-tight md:leading-relaxed">
                 <p className="text-white text-sm md:text-base leading-relaxed">
            Pague <span className="font-bold text-white">apenas R$79 reais</span> de entrada e parcele suas primeiras mensalidades ao longo do curso. <br />
            Assim, o valor fica diluído, <span className="font-bold text-white">leve e fácil de organizar no seu orçamento.</span>
          </p>
                </div>
              </div>
            </div>

            {/* Right side - Triangles Image */}
            <div className="flex-shrink-0 hidden md:block">
              <img 
                src="/triangles.png" 
                alt="Decorative triangles" 
                className="h-20 w-auto object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Pós-Graduação */}
      <section className="py-6 md:py-8" style={{ backgroundColor: "#16375CFF" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 items-center">
            {/* Coluna Esquerda - Conteúdo */}
            <div className="text-white lg:col-span-1 col-span-1">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 leading-tight">
                Especialize-se e <span className="text-orange-500">acelere</span><br />
                <span className="text-orange-500">sua carreira</span>
              </h2>
              <p className="text-base md:text-lg text-blue-100 mb-6 md:mb-8 leading-relaxed">
                Dê o próximo passo na sua carreira com nossas especializações, MBAs e cursos de pós-graduação reconhecidos pelo mercado.
              </p>
              
              {/* Benefícios */}
              <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-6 h-6 text-orange-500" />
                  <span className="text-md">Aumento médio de 40% no salário após a especialização</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="w-6 h-6 text-orange-500" />
                  <span className="text-md">Professores com experiência executiva</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Award className="w-6 h-6 text-orange-500" />
                  <span className="text-md">Certificação reconhecida pelo MEC</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/pos-mba')}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 inline-flex items-center space-x-2"
              >
                <span>CONHEÇA NOSSA PÓS</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Coluna Direita - Lista de Cursos */}
            <div className="space-y-4 hidden lg:block">
              {/* MBA em Gestão de Pessoas */}
              <button
                onClick={() => navigate('/pos-mba')}
                className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 text-left hover:bg-white/20 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-orange-400 text-sm font-semibold mb-1">ESPECIALIZAÇÃO</div>
                    <div className="text-white text-base font-semibold">Engenharia de Segurança do Trabalhos</div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </button>

              {/* Especialização em Marketing Digital */}
              <button
                onClick={() => navigate('/pos-mba')}
                className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 text-left hover:bg-white/20 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-orange-400 text-sm font-semibold mb-1">MBA</div>
                    <div className="text-white text-base font-semibold">Administração Hospitalar</div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </button>

              {/* Pós em Direito Empresarial */}
              <button
                onClick={() => navigate('/pos-mba')}
                className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 text-left hover:bg-white/20 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-orange-400 text-sm font-semibold mb-1">ESPECIALIZAÇÃO</div>
                    <div className="text-white text-base font-semibold">Gestão de Pessoas e Psicologia Organizacional</div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </button>

              {/* MBA em Finanças Corporativas */}
              <button
                onClick={() => navigate('/pos-mba')}
                className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 text-left hover:bg-white/20 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-orange-400 text-sm font-semibold mb-1">MBA</div>
                    <div className="text-white text-base font-semibold">Logística e Supply Chain</div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </button>

              {/* Especialização em Engenharia de Segurança */}
              <button
                onClick={() => navigate('/pos-mba')}
                className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 text-left hover:bg-white/20 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-orange-400 text-sm font-semibold mb-1">ESPECIALIZAÇÃO</div>
                    <div className="text-white text-base font-semibold">Psicanálise</div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Cursos Técnicos Section */}
      <section className="py-6 md:py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-4">
              Novos Cursos Técnicos
            </h2>
            <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
              Qualificação profissional de qualidade
            </p>
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Column 1 - EXATAS */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
              <div className="relative h-40 md:h-48 overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/3862132/pexels-photo-3862132.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Exatas - Engenharia e Construção"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-xl font-bold text-white">EXATAS</h3>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-gray-700 font-medium">Técnico em Desenho de Construção Civil</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2 - NEGÓCIOS */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
              <div className="relative h-40 md:h-48 overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Negócios - Administração e Gestão"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-xl font-bold text-white">NEGÓCIOS</h3>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-gray-700 font-medium">Marketing</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-gray-700 font-medium">Vendas</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-gray-700 font-medium">Administração</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-gray-700 font-medium">Contabilidade</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-gray-700 font-medium">Logística</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 3 - TECNOLOGIA */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
              <div className="relative h-40 md:h-48 overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Tecnologia - Programação e Sistemas"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-xl font-bold text-white">TECNOLOGIA</h3>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-gray-700 font-medium">Desenvolvimento de Sistemas</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-gray-700 font-medium">Manutenção e Suporte em Informática</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Carousel */}
          <div className="md:hidden mb-4">
            <div className="flex overflow-x-auto space-x-4 pb-4 snap-x snap-mandatory scrollbar-hide">
              {/* Mobile Card 1 - EXATAS */}
              <div className="flex-none w-80 bg-white rounded-xl shadow-md overflow-hidden snap-start">
                <div className="relative h-32 overflow-hidden">
                  <img
                    src="https://images.pexels.com/photos/3862132/pexels-photo-3862132.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Exatas - Engenharia e Construção"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-2 left-4">
                    <h3 className="text-lg font-bold text-white">EXATAS</h3>
                  </div>
                </div>
                <div className="p-4">
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                      <span className="text-gray-700 text-md font-medium">Técnico em Desenho de Construção Civil</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Card 2 - NEGÓCIOS */}
              <div className="flex-none w-80 bg-white rounded-xl shadow-md overflow-hidden snap-start">
                <div className="relative h-32 overflow-hidden">
                  <img
                    src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Negócios - Administração e Gestão"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-2 left-4">
                    <h3 className="text-lg font-bold text-white">NEGÓCIOS</h3>
                  </div>
                </div>
                <div className="p-4">
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                      <span className="text-gray-700 text-md font-medium">Marketing</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                      <span className="text-gray-700 text-md font-medium">Vendas</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                      <span className="text-gray-700 text-md font-medium">Administração</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                      <span className="text-gray-700 text-md font-medium">Contabilidade</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                      <span className="text-gray-700 text-md font-medium">Logística</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Card 3 - TECNOLOGIA */}
              <div className="flex-none w-80 bg-white rounded-xl shadow-md overflow-hidden snap-start">
                <div className="relative h-32 overflow-hidden">
                  <img
                    src="https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Tecnologia - Programação e Sistemas"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-2 left-4">
                    <h3 className="text-lg font-bold text-white">TECNOLOGIA</h3>
                  </div>
                </div>
                <div className="p-4">
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                      <span className="text-gray-700 text-md font-medium">Desenvolvimento de Sistemas</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                      <span className="text-gray-700 text-md font-medium">Manutenção e Suporte em Informática</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Single CTA Button */}
          <div className="text-center mt-12">
            <button
              onClick={() => navigate('/cursos-tecnicos')}
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-4 px-12 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-lg"
            >
              Saiba Mais
            </button>
          </div>
        </div>
      </section>

      {/* Escolha como ingressar */}
      <section className="py-4 md:py-6 md:pb-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-4">
              Escolha como ingressar
            </h2>
            <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
              Diferentes formas de começar sua jornada acadêmica na Anhanguera
            </p>
          </div>

          {/* Desktop Grid - 4 columns layout */}
          <div className="hidden md:grid grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
            {/* Column 1: Vestibular Online (tall card) */}
            <div className="h-96 px-6 py-6 rounded-2xl border-[3px] border-orange-500 bg-white flex flex-col justify-between">
              <div className="flex flex-col gap-4">
                <div className="text-orange-500 text-xl font-bold">
                  Vestibular Online
                </div>
                <div className="text-orange-500 text-sm leading-relaxed">
                  Com o Vestibular Online Anhanguera, você escolhe quando e onde realizar sua redação, com toda a comodidade. Além disso, pode garantir bolsas de até 100% para iniciar sua graduação com mais tranquilidade.
                </div>
              </div>
              <button
                onClick={() => navigate('/precos-form')}
                className="w-full h-12 px-4 py-2 rounded-3xl border-[3px] border-orange-500 flex justify-center items-center gap-2 hover:bg-orange-500 hover:text-white transition-all duration-300 group"
              >
                <span className="text-orange-500 text-sm font-medium group-hover:text-white">
                  Entrar em contato
                </span>
                <ArrowRight className="w-4 h-4 text-orange-500 group-hover:text-white" />
              </button>
            </div>

            {/* Column 2: Transferência (top) + Ex-Alunos (bottom) */}
            <div className="flex flex-col gap-6">
              {/* Transferência */}
              <div className="h-44 px-5 py-4 bg-orange-500 rounded-2xl flex flex-col justify-between">
                <div className="flex flex-col gap-2">
                  <div className="text-white text-lg font-bold">
                    Transferência
                  </div>
                  <div className="text-white text-sm">
                    Na Anhanguera, sua nota do ENEM vale muito: quanto maior a pontuação, maior o desconto na mensalidade.
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => navigate('/precos-form')}
                    className="w-12 h-10 rounded-3xl border-[3px] border-white hover:bg-white transition-all duration-300 flex items-center justify-center group"
                  >
                    <ArrowRight className="w-5 h-5 text-white group-hover:text-orange-500" />
                  </button>
                </div>
              </div>

              {/* Ex-Alunos */}
              <div className="h-44 px-5 py-4 bg-orange-500 rounded-2xl flex flex-col justify-between">
                <div className="flex flex-col gap-2">
                  <div className="text-white text-lg font-bold">
                    Ex-Alunos
                  </div>
                  <div className="text-white text-sm">
                    Ex-alunos Anhanguera têm benefícios exclusivos para continuar sua jornada acadêmica.
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => navigate('/precos-form')}
                    className="w-12 h-10 rounded-3xl border-[3px] border-white hover:bg-white transition-all duration-300 flex items-center justify-center group"
                  >
                    <ArrowRight className="w-5 h-5 text-white group-hover:text-orange-500" />
                  </button>
                </div>
              </div>
            </div>

            {/* Column 3: ENEM (tall card) */}
            <div className="h-96 px-6 py-6 bg-blue-950 rounded-2xl flex flex-col justify-between">
              <div className="flex flex-col gap-4">
                <div className="text-white text-xl font-bold">
                  ENEM
                </div>
                <div className="text-white text-sm leading-relaxed">
                  Na Anhanguera, sua nota do ENEM vale muito: quanto maior a pontuação, maior o desconto na mensalidade.
                  <br /><br />
                  Aproveite essa oportunidade para iniciar sua graduação com condições especiais.
                </div>
              </div>
              <button
                onClick={() => navigate('/precos-form')}
                className="w-full h-12 px-4 py-2 rounded-3xl border-[3px] border-white flex justify-center items-center gap-2 hover:bg-white hover:text-blue-950 transition-all duration-300 group"
              >
                <span className="text-white text-sm font-medium group-hover:text-blue-950">
                  Entrar em contato
                </span>
                <ArrowRight className="w-4 h-4 text-white group-hover:text-blue-950" />
              </button>
            </div>

            {/* Column 4: PROUNI e FIES (top) + 2ª Graduação (bottom) */}
            <div className="flex flex-col gap-6">
              {/* PROUNI e FIES */}
              <div className="h-44 px-5 py-4 rounded-2xl border-[3px] border-orange-500 bg-white flex flex-col justify-between">
                <div className="flex flex-col gap-2">
                  <div className="text-orange-500 text-lg font-bold">
                    PROUNI e FIES
                  </div>
                  <div className="text-orange-500 text-sm">
                    Conheça as opções de bolsas do PROUNI e de financiamento pelo FIES disponíveis.
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => navigate('/precos-form')}
                    className="w-12 h-10 rounded-3xl border-[3px] border-orange-500 hover:bg-orange-500 transition-all duration-300 flex items-center justify-center group"
                  >
                    <ArrowRight className="w-5 h-5 text-orange-500 group-hover:text-white" />
                  </button>
                </div>
              </div>

              {/* 2ª Graduação */}
              <div className="h-44 px-5 py-4 bg-orange-500 rounded-2xl flex flex-col justify-between">
                <div className="flex flex-col gap-2">
                  <div className="text-white text-lg font-bold">
                    2ª Graduação
                  </div>
                  <div className="text-white text-sm">
                    Já concluiu uma graduação e quer expandir sua carreira? Faça sua segunda graduação com descontos exclusivos.
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => navigate('/precos-form')}
                    className="w-12 h-10 rounded-3xl border-[3px] border-white hover:bg-white transition-all duration-300 flex items-center justify-center group"
                  >
                    <ArrowRight className="w-5 h-5 text-white group-hover:text-orange-500" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Version */}
          <div className="md:hidden mb-4">
            <div className="flex overflow-x-auto space-x-4 pb-4 snap-x snap-mandatory scrollbar-hide">
              {/* Vestibular Online */}
              <div className="flex-none w-80 px-5 py-7 rounded-2xl border-[3px] border-orange-600 flex flex-col justify-between min-h-[400px] snap-start">
                <div className="flex flex-col justify-start items-start gap-6">
                  <div className="text-orange-600 text-2xl md:text-3xl font-extrabold">
                    Vestibular Online
                  </div>
                  <div className="text-orange-600 text-lg font-medium leading-relaxed">
                    Com o Vestibular Online Anhanguera, você escolhe quando e onde realizar sua redação, com toda a comodidade.<br />
                    <br /> Além disso, pode garantir bolsas de até 100% para iniciar sua graduação com mais tranquilidade.
                  </div>
                </div>
                <button
                  onClick={() => navigate('/precos-form')}
                  className="w-full h-12 px-4 py-2 rounded-3xl border-[3px] border-orange-600 flex justify-center items-center gap-2 hover:bg-orange-600 hover:text-white transition-all duration-300 group mt-4"
                >
                  <span className="text-orange-600 text-lg font-medium group-hover:text-white">
                    Entrar em contato
                  </span>
                  <ArrowRight className="w-4 h-4 text-orange-600 group-hover:text-white" />
                </button>
              </div>

              {/* ENEM */}
              <div className="flex-none w-80 px-5 py-7 bg-[#16375C] rounded-2xl flex flex-col justify-between min-h-[400px] snap-start">
                <div className="flex flex-col justify-start items-start gap-4">
                  <div className="text-white text-2xl md:text-3xl font-bold">
                    ENEM
                  </div>
                  <div className="text-white text-lg font-medium leading-relaxed">
                    Na Anhanguera, sua nota do ENEM vale muito: quanto maior a pontuação, maior o desconto na mensalidade.<br />
                    <br /> Aproveite essa oportunidade para iniciar sua graduação com condições especiais.
                  </div>
                </div>
                <button
                  onClick={() => navigate('/precos-form')}
                  className="w-full h-12 px-4 py-2 rounded-3xl border-[3px] border-white flex justify-center items-center gap-2 hover:bg-white hover:text-blue-950 transition-all duration-300 group mt-4"
                >
                  <span className="text-white text-lg font-medium group-hover:text-blue-950">
                    Entrar em contato
                  </span>
                  <ArrowRight className="w-4 h-4 text-orange-200 group-hover:text-blue-950" />
                </button>
              </div>

              {/* Transferência */}
              <div className="flex-none w-80 px-6 py-5 bg-orange-600 rounded-2xl flex flex-col justify-between min-h-[250px] snap-start">
                <div className="flex flex-col justify-start items-start gap-2">
                  <div className="text-white text-2xl md:text-3xl font-bold">
                    Transferência
                  </div>
                  <div className="text-white text-lg font-medium">
                    Se você já estuda em outra instituição, aproveite para transferir sua matrícula para a Anhanguera e conquistar descontos exclusivos para continuar sua graduação.
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => navigate('/precos-form')}
                    className="w-16 h-14 rounded-3xl border-[3px] border-white hover:bg-white hover:border-orange-600 transition-all duration-300 flex items-center justify-center group"
                  >
                    <ArrowRight className="w-5 h-5 text-white group-hover:text-orange-600" />
                  </button>
                </div>
              </div>

              {/* 2ª Graduação */}
              <div className="flex-none w-80 px-5 py-6 bg-orange-600 rounded-2xl flex flex-col justify-between min-h-[250px] snap-start">
                <div className="flex flex-col justify-start items-start gap-3">
                  <div className="text-white text-2xl md:text-3xl font-bold">
                    2ª Graduação
                  </div>
                  <div className="text-white text-lg font-medium">
                    Já concluiu uma graduação e quer expandir sua carreira? Na Anhanguera, você faz sua segunda graduação com descontos exclusivos e toda a qualidade de ensino que já conhece.
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => navigate('/precos-form')}
                    className="w-16 h-14 rounded-3xl border-[3px] border-white hover:bg-white hover:border-orange-600 transition-all duration-300 flex items-center justify-center group"
                  >
                    <ArrowRight className="w-5 h-5 text-white group-hover:text-orange-600" />
                  </button>
                </div>
              </div>

              {/* PROUNI e FIES */}
              <div className="flex-none w-80 px-5 py-5 rounded-2xl border-2 border-orange-600 flex flex-col justify-between min-h-[300px] snap-start">
                <div className="flex flex-col justify-start items-start gap-2.5">
                  <div className="text-orange-600 text-2xl md:text-3xl font-bold">
                    PROUNI e FIES
                  </div>
                  <div className="text-orange-600 text-lg font-medium leading-relaxed">
                    Quer estudar com mais tranquilidade financeira? Conheça as opções de bolsas do PROUNI e de financiamento pelo FIES disponíveis.
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => navigate('/precos-form')}
                    className="w-16 h-14 rounded-3xl border-[3px] border-orange-600 hover:bg-orange-600 transition-all duration-300 flex items-center justify-center group"
                  >
                    <ArrowRight className="w-5 h-5 text-orange-600 group-hover:text-white" />
                  </button>
                </div>
              </div>

              {/* Ex-Alunos */}
              <div className="flex-none w-80 px-7 py-6 bg-orange-600 rounded-2xl flex flex-col justify-between min-h-[250px] snap-start">
                <div className="flex flex-col justify-start items-start gap-2">
                  <div className="text-white text-2xl md:text-3xl font-bold">
                    Ex-Alunos
                  </div>
                  <div className="text-white text-lg font-medium">
                    Ex-alunos Anhanguera têm benefícios exclusivos para continuar sua jornada acadêmica. Volte para conquistar uma nova graduação ou pós-graduação com bolsas especiais e condições diferenciadas.
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => navigate('/precos-form')}
                    className="w-16 h-14 rounded-3xl border-[3px] border-white hover:bg-white hover:border-orange-600 transition-all duration-300 flex items-center justify-center group"
                  >
                    <ArrowRight className="w-5 h-5 text-white group-hover:text-orange-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Por que escolher a Anhanguera */}
      <section className="py-6 md:py-8 bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-4">
              Por que escolher a Anhanguera?
            </h2>
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {advantages.map((advantage, index) => {
              const Icon = advantage.icon;
              return (
                <div
                  key={index}
                  className="border-2 border-orange-500 p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group text-center"
                >
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:from-orange-600 group-hover:to-orange-700 transition-all duration-300">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-orange-500 mb-3 group-hover:text-orange-600 transition-colors duration-300">
                    {advantage.title}
                  </h3>
                  <p className="text-orange-500 text-base leading-relaxed">
                    {advantage.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Mobile Carousel */}
          <div className="md:hidden mb-4">
            <div className="flex overflow-x-auto space-x-4 pb-4 snap-x snap-mandatory scrollbar-hide">
              {advantages.map((advantage, index) => {
                const Icon = advantage.icon;
                return (
                  <div
                    key={index}
                    className="flex-none w-72 bg-white p-6 rounded-xl shadow-md text-center snap-start"
                  >
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                      {advantage.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-sm">
                      {advantage.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Por que escolher a Anhanguera */}
      <section className="py-6 md:py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-6">
                Quem Somos
              </h2>
              <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-3 md:mb-4">
               Na SOEAD, acreditamos que o futuro começa com a educação. Com 7 anos de experiência, oferecemos Graduação e Pós-graduação em modalidades EAD e semipresencial, com qualidade reconhecida pelo MEC, diplomas valorizados e a flexibilidade que a sua rotina precisa.
              </p>
              <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-3 md:mb-4">
                São 5 polos em São Paulo, com mais de 100 opções de Graduação e mais de 300 cursos de Pós e MBA 100% online, para você estudar no seu ritmo e de onde estiver.
              </p>
              <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-3 md:mb-4">
                Porque a vida é corrida, mas o seu futuro não pode esperar.
              </p>
              <div className="flex flex-wrap gap-3 md:gap-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700 font-medium text-sm md:text-base">Reconhecidos pelo MEC</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700 font-medium text-sm md:text-base">Cursos EAD ou Semipresencial</span>
                </div>
                
              </div>
            </div>
            <div className="relative hidden md:block">
              <img 
                src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Estudantes Anhanguera"
                className="rounded-xl shadow-2xl w-full h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-3 md:py-4 md:pb-6">
        <div className="max-w-4xl mx-auto text-center px-3 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/precos-form')}
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-2 md:py-3 px-4 md:px-5 rounded-lg hover:from-orange-600 hover:to-orange-700 transform hover:scale-105 transition-all duration-300 shadow-xl inline-flex items-center space-x-2 text-sm md:text-base"
          >
            <span>Inscreva-se Agora</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Modal de Preço */}
      <PriceModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        course={selectedCourse}
      />
    </div>
  );
}