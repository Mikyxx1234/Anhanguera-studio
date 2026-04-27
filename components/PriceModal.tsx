import React, { useState, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import { CourseService } from '../services/courseService';
import { InscricaoService } from '../services/inscricaoService';

interface Course {
  id: number;
  name: string;
  price: number;
  formation?: string;
  modality?: string;
  priceNormal?: number;
  priceIntensive?: number;
}

interface PriceModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course | null;
}

export default function PriceModal({ isOpen, onClose, course }: PriceModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    modality: ''
  });
  const [showPrice, setShowPrice] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coursePrice, setCoursePrice] = useState<number | null>(null);
  const [priceSource, setPriceSource] = useState<'database' | 'fallback'>('fallback');
  const [isLoadingPrice, setIsLoadingPrice] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState<'normal' | 'intensive'>('normal');

  // Parse modalities from course data
  const getModalities = (course: Course) => {
    if (!course?.modality) return [];
    return course.modality.split('/').map(m => m.trim());
  };

  const modalities = course ? getModalities(course) : [];
  const hasMultipleModalities = modalities.length > 1;

  React.useEffect(() => {
    if (isOpen) {
      setSelectedDuration('normal'); // Sempre começar com a duração normal (menor preço)
      setShowPrice(false); // Resetar visualização de preço
      setFormData({ name: '', phone: '', modality: '' }); // Limpar formulário
    }
  }, [isOpen]);

  // Função para buscar o preço do curso
  const fetchCoursePrice = async (courseName: string, modality: string) => {
    if (!course) return;
    
    setIsLoadingPrice(true);
    try {
      const result = await CourseService.getCoursePriceWithFallback(
        courseName, 
        modality, 
        course.price
      );
      
      setCoursePrice(result.price);
      setPriceSource(result.source);
    } catch (error) {
      setCoursePrice(course.price);
      setPriceSource('fallback');
    } finally {
      setIsLoadingPrice(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    
    // If single modality, set it automatically
    const finalFormData = {
      ...formData,
      modality: hasMultipleModalities ? formData.modality : modalities[0] || ''
    };
    
    try {
      // Determinar tipo de curso baseado no formation
      // Valores permitidos: 'graduacao', 'pos-graduacao', 'curso-tecnico' ou 'curso-profissionalizante'
      let tipoDeCurso = 'graduacao'; // Padrão para Bacharelado, Licenciatura, Tecnólogo
      if (course.formation === 'MBA' || course.formation === 'Especialista') {
        tipoDeCurso = 'pos-graduacao';
      } else if (course.formation === 'Técnico') {
        tipoDeCurso = 'curso-tecnico';
      } else if (course.formation === 'Profissionalizante') {
        tipoDeCurso = 'curso-profissionalizante';
      }
      
      // Detectar a página atual pelo pathname
      const pathname = window.location.pathname;
      let paginaAtual = 'graduacao'; // Padrão
      if (pathname.includes('/pos-mba')) {
        paginaAtual = 'pos-mba';
      } else if (pathname.includes('/cursos-tecnicos')) {
        paginaAtual = 'cursos-tecnicos';
      } else if (pathname.includes('/cursos-profissionalizantes')) {
        paginaAtual = 'cursos-profissionalizantes';
      } else if (pathname.includes('/graduacao')) {
        paginaAtual = 'graduacao';
      }
      
      // Salvar inscrição no banco de dados
      const inscricaoData = {
        nome_completo: formData.name, // Apenas o nome
        celular: formData.phone,
        email: null,
        tipo_de_curso: tipoDeCurso, // graduacao ou pos-graduacao
        pagina: paginaAtual, // Página atual detectada automaticamente
        campanha: new URLSearchParams(window.location.search).get('utm_campaign') || null,
        status: 'novo',
        nome_curso: course.name, // Nome do curso em campo separado
      };

      const result = await InscricaoService.saveInscricao(inscricaoData);
      
      if (!result.success) {
        console.error('Erro ao salvar inscrição:', result.error);
        // Continua mesmo se houver erro ao salvar
        // Permite o usuário ver o preço mesmo se falhar ao salvar
      } else {
        console.log('✅ Inscrição salva com sucesso!');
      }
      
      // Buscar preço do curso
      await fetchCoursePrice(course.name, finalFormData.modality);
    } catch (error) {
      console.error('Erro ao processar inscrição:', error);
      // Continua mesmo se houver erro ao salvar ou buscar preço
      // Usa o preço padrão do curso
      setCoursePrice(course.price);
      setPriceSource('fallback');
    }
    
    // Call appropriate conversion function based on course type
    if (course.formation === 'MBA' || course.formation === 'Especialista') {
      // @ts-ignore - Global function from Google Ads
      if (typeof window.gtag_report_conversion_pos === 'function') {
        window.gtag_report_conversion_pos();
      }
    } else {
      // @ts-ignore - Global function from Google Ads
      if (typeof window.gtag_report_conversion_graduacao === 'function') {
        window.gtag_report_conversion_graduacao();
      }
    }
    
    // Show price after loading
    setTimeout(() => {
      setShowPrice(true);
      setIsSubmitting(false);
    }, 1000);
  };

  // Função para formatar telefone
  const formatPhone = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    // Limita a 11 dígitos (DDD + 9 dígitos)
    const limited = numbers.slice(0, 11);
    
    // Aplica a máscara
    if (limited.length <= 2) {
      return limited;
    } else if (limited.length <= 7) {
      return `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
    } else {
      return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7)}`;
    }
  };

  // Função para validar telefone brasileiro
  const isValidPhone = (phone: string) => {
    const numbers = phone.replace(/\D/g, '');
    
    // Deve ter 10 ou 11 dígitos (DDD + número)
    if (numbers.length < 10 || numbers.length > 11) return false;
    
    // Validar DDD (todos os DDDs válidos do Brasil)
    const ddd = parseInt(numbers.slice(0, 2));
    const validDDDs = [
      11, 12, 13, 14, 15, 16, 17, 18, 19, // SP
      21, 22, 24, // RJ
      27, 28, // ES
      31, 32, 33, 34, 35, 37, 38, // MG
      41, 42, 43, 44, 45, 46, // PR
      47, 48, 49, // SC
      51, 53, 54, 55, // RS
      61, // DF
      62, 64, // GO
      63, // TO
      65, 66, // MT
      67, // MS
      68, 69, // AC, RO
      71, 73, 74, 75, 77, // BA
      79, // SE
      81, 87, // PE
      82, // AL
      83, // PB
      84, // RN
      85, 88, // CE
      86, 89, // PI
      91, 93, 94, // PA
      92, 97, // AM
      95, // RR
      96, // AP
      98, 99 // MA
    ];
    
    if (!validDDDs.includes(ddd)) return false;
    
    // Se tiver 11 dígitos, o primeiro dígito após o DDD deve ser 9 (celular)
    if (numbers.length === 11 && numbers[2] !== '9') return false;
    
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      // Aplica a formatação apenas para o campo de telefone
      const formatted = formatPhone(value);
      setFormData(prev => ({
        ...prev,
        phone: formatted
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const resetModal = () => {
    setFormData({ name: '', phone: '', modality: '' });
    setShowPrice(false);
    setCoursePrice(null);
    setPriceSource('fallback');
    setIsLoadingPrice(false);
    onClose();
  };

  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">
            {course.name}
          </h3>
          <button
            onClick={resetModal}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {!showPrice ? (
            /* Formulário */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-800 mb-2">
                  Nome *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                  placeholder="Digite seu nome completo"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-800 mb-2">
                  Celular *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all duration-300 ${
                    formData.phone && !isValidPhone(formData.phone)
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-orange-500'
                  }`}
                  placeholder="(11) 99999-9999"
                />
                {formData.phone && !isValidPhone(formData.phone) && (
                  <p className="text-xs text-red-600 mt-1">
                    Digite um telefone válido com DDD (ex: 11 99999-9999)
                  </p>
                )}
              </div>

              {/* Show modality dropdown only if course has multiple modalities */}
              {hasMultipleModalities && (
                <div>
                  <label htmlFor="modality" className="block text-sm font-semibold text-gray-800 mb-2">
                    Modalidade *
                  </label>
                  <select
                    id="modality"
                    name="modality"
                    required
                    value={formData.modality}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 appearance-none bg-white"
                  >
                    <option value="">Selecione a modalidade</option>
                    {modalities.map((modality) => (
                      <option key={modality} value={modality}>
                        {modality}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || isLoadingPrice || !isValidPhone(formData.phone) || !formData.name.trim()}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-3 px-6 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting || isLoadingPrice ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Enviar</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Mostrar Preço */
            <div className={`text-center ${course.formation === 'MBA' || course.formation === 'Especialista' ? 'py-2' : 'py-8'}`}>
              {course.formation === 'MBA' || course.formation === 'Especialista' ? (
                /* Preços para Pós-Graduação - Mostrar preço da duração selecionada */
                <>
                  {/* Durações Disponíveis - CLICÁVEIS */}
                  <div className="bg-white rounded-xl p-4 border border-gray-200 mb-4">
                    <h5 className="text-sm font-semibold text-gray-700 mb-3">
                      Escolha a duração ideal para você:
                    </h5>
                    <div className="space-y-2 text-left">
                      <button
                        onClick={() => setSelectedDuration('normal')}
                        className={`w-full flex flex-col p-3 rounded-lg transition-all duration-300 ${
                          selectedDuration === 'normal'
                            ? 'bg-green-100 border-2 border-green-500 shadow-md'
                            : 'bg-green-50 border border-green-200 hover:bg-green-100'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-1">
                          <span className="text-sm font-semibold text-green-700">📚 Normal - 10 meses</span>
                          <span className="text-sm text-green-600">
                            {course.priceNormal ? `R$ ${course.priceNormal.toFixed(2).replace('.', ',')}` : 'Consulte'}
                          </span>
                        </div>
                        <span className="text-xs text-green-600">18x parcelas</span>
                      </button>

                      <button
                        onClick={() => setSelectedDuration('intensive')}
                        className={`w-full flex flex-col p-3 rounded-lg transition-all duration-300 ${
                          selectedDuration === 'intensive'
                            ? 'bg-yellow-100 border-2 border-yellow-500 shadow-md'
                            : 'bg-yellow-50 border border-yellow-200 hover:bg-yellow-100'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-1">
                          <span className="text-sm font-semibold text-yellow-700">⚡ Intensivo - 6 meses</span>
                          <span className="text-sm text-yellow-600">
                            {course.priceIntensive ? `R$ ${course.priceIntensive.toFixed(2).replace('.', ',')}` : 'Consulte'}
                          </span>
                        </div>
                        <span className="text-xs text-yellow-600">18x parcelas</span>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                /* Preço para Graduação */
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 mb-6">
                  <h4 className="text-lg font-semibold text-green-800 mb-2">
                    Mensalidade a partir de:
                  </h4>
                  <div className="text-4xl font-bold text-green-700 mb-2">
                    R$ {((coursePrice || course.price || 0)).toFixed(2).replace('.', ',')}
                  </div>
                  <p className="text-sm text-green-600">
                    *Condições especiais aplicáveis
                  </p>
                </div>
              )}
              
              <p className="text-gray-600 mb-6">
                Entre em contato conosco para mais informações e condições especiais!
              </p>
              
              <button
                onClick={() => window.open('https://api.whatsapp.com/send?phone=5511992793249', '_blank')}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-3 px-6 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300"
              >
                Falar no WhatsApp
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}