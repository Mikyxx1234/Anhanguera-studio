import React, { useState } from 'react';
import { Send } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import Breadcrumb from '../components/Breadcrumb';
import { InscricaoService } from '../services/inscricaoService';

export default function PrecosFormPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    courseType: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Função para formatar telefone
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 11) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar telefone antes de enviar
    if (!isValidPhone(formData.phone)) {
      alert('Por favor, digite um telefone válido com DDD brasileiro.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Salvar inscrição no banco de dados
      const inscricaoData = {
        nome_completo: formData.name,
        celular: formData.phone,
        email: formData.email || null,
        tipo_de_curso: formData.courseType, // 'graduacao' ou 'pos-graduacao'
        pagina: 'inscreva-se',
        campanha: new URLSearchParams(window.location.search).get('utm_campaign') || null,
        status: 'novo',
        nome_curso: null, // Não tem curso específico nesta página
      };

      const result = await InscricaoService.saveInscricao(inscricaoData);
      
      if (!result.success) {
        console.error('Erro ao salvar inscrição:', result.error);
        alert('Erro ao enviar formulário. Por favor, tente novamente.\n\nDetalhes: ' + (result.error?.message || 'Erro desconhecido'));
        setIsSubmitting(false);
        return;
      }

      console.log('✅ Inscrição salva com sucesso!');
      
      // Call appropriate conversion function based on course type
      if (formData.courseType === 'pos-graduacao') {
        // @ts-ignore - Global function from Google Ads
        if (typeof window.gtag_report_conversion_pos === 'function') {
          window.gtag_report_conversion_pos();
        }
      } else if (formData.courseType === 'graduacao') {
        // @ts-ignore - Global function from Google Ads
        if (typeof window.gtag_report_conversion_graduacao === 'function') {
          window.gtag_report_conversion_graduacao();
        }
      }
      
      // Redirecionar para a página apropriada COM flag temporário na URL
      if (formData.courseType === 'pos-graduacao') {
        window.location.href = '/pos-mba?show=prices';
      } else {
        window.location.href = '/graduacao?show=prices';
      }
    } catch (error: any) {
      console.error('Erro ao enviar formulário:', error);
      alert('Erro ao enviar formulário. Por favor, tente novamente.\n\nDetalhes: ' + (error?.message || 'Erro desconhecido'));
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Formatar telefone automaticamente
    if (name === 'phone') {
      setFormData(prev => ({
        ...prev,
        [name]: formatPhone(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <SEOHead
        title="Contato - Transforme sua vida estudando na Anhanguera"
        description="Entre em contato conosco e conquiste descontos exclusivos. Preencha seus dados para visualizar os preços especiais dos nossos cursos."
        path="/precos-form"
        image="/BG_Forms.png"
      />
      
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'Contato' }]} />
      
      <section 
        className="py-6 md:py-12 min-h-screen flex items-center"
        style={{
          backgroundImage: `url('https://www.soead.com.br/BG_Inscreva-se.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-xl">
            {/* Formulário */}
              <div className="bg-white rounded-xl shadow-xl p-6 md:p-8">
                <div className="mb-6 md:mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-orange-500 mb-2 md:mb-3">
                  Transforme sua vida
estudando na Anhanguera!
                </h2>
                <p className="text-sm md:text-base text-gray-600">
                  Preencha seus dados para visualizar os preços especiais
                </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-800 mb-1 md:mb-2">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                      placeholder="Digite seu nome completo"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:gap-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-1 md:mb-2">
                        E-mail *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                        placeholder="seu@email.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-gray-800 mb-1 md:mb-2">
                        Celular *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                        placeholder="(11) 99999-9999"
                      />
                      {formData.phone && !isValidPhone(formData.phone) && (
                        <p className="text-xs text-red-600 mt-1">
                          Digite um telefone válido com DDD (ex: 11 99999-9999)
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="courseType" className="block text-sm font-semibold text-gray-800 mb-1 md:mb-2">
                        Escolha o tipo de curso *
                      </label>
                      <select
                        id="courseType"
                        name="courseType"
                        required
                        value={formData.courseType}
                        onChange={handleChange}
                        className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 appearance-none bg-white"
                      >
                        <option value="">Selecione o tipo de curso</option>
                        <option value="graduacao">Graduação</option>
                        <option value="pos-graduacao">Pós-graduação</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !formData.name || !formData.phone || !isValidPhone(formData.phone) || !formData.courseType}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-3 md:py-4 px-4 md:px-6 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                  >
                    {isSubmitting ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Ver preço</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
          </div>
        </div>
      </section>
    </div>
  );
}