import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Monitor, GraduationCap, ArrowRight, CheckCircle, Info } from 'lucide-react';

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

interface CourseCardProps {
  course: Course;
  onViewPrice: (course: Course) => void;
  showPrices: boolean;
  category: string;
  key?: React.Key;
}

export default function CourseCard({ course, onViewPrice, showPrices, category }: CourseCardProps) {
  const [showPosModal, setShowPosModal] = React.useState(false);

  const PosDoSeuJeitoModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-orange-600">Pós do Seu Jeito</h3>
          <button
            onClick={() => setShowPosModal(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-300 text-2xl"
          >
            ×
          </button>
        </div>
        <div className="p-6">
          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Pós do Seu Jeito Anhanguera</strong> é a especialização que se adapta à sua rotina e aos seus objetivos de carreira.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
           Você tem a liberdade de personalizar o curso escolhendo as disciplinas que mais fazem sentido para o seu futuro profissional, com a flexibilidade para estudar quando e onde quiser. São 12 cursos disponíveis em 6 áreas de conhecimento: Direito, Educação, Engenharia, Negócios, Saúde e Tecnologia, todos com duração de apenas 10 meses.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Com a Pós do Seu Jeito, você controla seu desenvolvimento acadêmico e garante que a sua formação seja exatamente o que o mercado de trabalho exige. Monte sua especialização de acordo com as suas metas, conquiste mais autonomia nos estudos e avance na sua carreira com um curso pensado para o seu ritmo e para o seu futuro.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 group">
        <div className="p-6">
          {/* Header do Card */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="inline-block px-3 py-1 bg-orange-100 text-orange-800 text-xs font-semibold rounded-full mb-2">
                {course.area}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors duration-300">
                {course.name}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                {course.description}
              </p>
              <Link 
                to={`/curso/${category}/${course.id}`}
                className="inline-flex items-center text-xs font-bold text-orange-600 hover:text-orange-700 hover:underline transition-all"
              >
                <Info className="w-3 h-3 mr-1" />
                Ver detalhes do curso
              </Link>
            </div>
          </div>

          {/* Informações do Curso */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center text-gray-600 text-sm">
              <Clock className="w-4 h-4 mr-2 text-orange-500" />
              <span>{course.formation === 'MBA' || course.formation === 'Especialista' ? 'Carga horária' : 'Duração'}: {course.duration}</span>
            </div>
            <div className="flex items-center text-gray-600 text-sm">
              <GraduationCap className="w-4 h-4 mr-2 text-orange-500" />
              <span>Formação: {course.formation}</span>
            </div>
            <div className="flex items-center text-gray-600 text-sm">
              <Monitor className="w-4 h-4 mr-2 text-orange-500" />
              <span>Modalidade: {course.modality}</span>
            </div>
            
            {/* Pós do Seu Jeito - Only for post-grad courses */}
            {course.posDoSeuJeito && (course.formation === 'MBA' || course.formation === 'Especialista') && isIncludedInPosDoSeuJeito(course.name) && (
              <button
                onClick={() => setShowPosModal(true)}
                className="flex items-center text-green-600 text-sm hover:text-green-700 transition-colors duration-300"
              >
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                <span>Pós do Seu Jeito</span>
              </button>
            )}
          </div>

          {/* Preço ou CTA */}
          <div className="mt-auto pt-4">
            {showPrices ? (
              /* Mostrar Preço Diretamente */
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                <div className="text-center">
                  <p className="text-sm font-semibold text-green-800 mb-1">
                    {course.formation === 'MBA' || course.formation === 'Especialista' 
                      ? 'Mensalidade a partir de:' 
                      : 'Mensalidade a partir de:'}
                  </p>
                  <p className="text-3xl font-bold text-green-700">
                    R$ {course.price.toFixed(2).replace('.', ',')}
                  </p>
                  <p className="text-xs text-green-600 mt-1">*Condições especiais aplicáveis</p>
                </div>
                <button
                  onClick={() => window.open('https://api.whatsapp.com/send?phone=5511992793249', '_blank')}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-medium py-2 px-4 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center space-x-2 mt-3"
                >
                  <span>Falar no WhatsApp</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* Botão Ver Preço */
              <button
                onClick={() => onViewPrice(course)}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium py-3 px-4 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex items-center justify-center space-x-2 group"
              >
                <span>Ver preço</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Pós do Seu Jeito Modal */}
      {showPosModal && <PosDoSeuJeitoModal />}
    </>
  );
}

// Function to check if course should be included in "Pós do Seu Jeito"
function isIncludedInPosDoSeuJeito(courseName: string): boolean {
  const includedCourses = [
    "Docência no Ensino Superior - estratégias inovadoras",
    "Engenharia de Produção e Qualidade - Inovação e Eficiência na Indústria",
    "Finanças e Controladoria",
    "Direito digital e compliance",
    "Saúde pública com ênfase em saúde da família",
    "Inteligência Artificial e Machine Learning",
    "Educação especial e inclusiva",
    "MBA em Gestão de Projetos e Agilidade",
    "MBA em Administração Hospitalar",
    "MBA em Gestão de Pessoas ESG, Liderança e Inovação",
    "ESG e Reputação Organizacional"
  ];
  
  return includedCourses.some(includedCourse => 
    courseName.toLowerCase().includes(includedCourse.toLowerCase()) ||
    includedCourse.toLowerCase().includes(courseName.toLowerCase())
  );
}