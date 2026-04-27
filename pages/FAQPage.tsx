import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { faqs, faqCategories } from '../data/faqs';
import SEOHead from '../components/SEOHead';
import Breadcrumb from '../components/Breadcrumb';

import { useNavigate } from 'react-router-dom';

export default function FAQPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [openItems, setOpenItems] = useState<number[]>([]);

  const filteredFaqs = faqs.filter(faq => 
    selectedCategory === 'Todas' || faq.category === selectedCategory
  );

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <SEOHead
        title="Perguntas Frequentes - Anhanguera"
        description="Encontre respostas para as principais dúvidas sobre nossos cursos, processo seletivo, financiamento e transferência na Anhanguera."
        path="/faq"
      />
      
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'FAQ' }]} />
      
      {/* Header */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 py-8 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <h1 className="text-2xl md:text-5xl font-bold text-white">
              Perguntas Frequentes
            </h1>
          </div>
          <p className="text-base md:text-xl text-blue-100 max-w-2xl mx-auto">
            Encontre respostas para as principais dúvidas sobre nossos cursos e processos
          </p>
        </div>
      </section>

      <section className="py-6 md:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filtros de Categoria */}
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-md mb-4 md:mb-8">
            <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">
              Filtrar por categoria:
            </h3>
            <div className="flex flex-wrap gap-1 md:gap-2">
              {faqCategories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 md:px-4 py-1 md:py-2 rounded-lg font-medium transition-all duration-300 text-sm md:text-base ${
                    selectedCategory === category
                      ? 'bg-orange-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-orange-100 hover:text-orange-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Lista de FAQs */}
          <div className="space-y-3 md:space-y-4">
            {filteredFaqs.map((faq) => (
              <div
                key={faq.id}
                className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
              >
                <button
                  onClick={() => toggleItem(faq.id)}
                  className="w-full p-4 md:p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-300"
                >
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-orange-600 mb-1 uppercase tracking-wide text-xs">
                      {faq.category}
                    </div>
                    <h3 className="text-base md:text-lg font-semibold text-gray-900">
                      {faq.question}
                    </h3>
                  </div>
                  <div className="ml-4">
                    {openItems.includes(faq.id) ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                </button>

                {openItems.includes(faq.id) && (
                  <div className="px-4 md:px-6 pb-4 md:pb-6 border-t border-gray-100 bg-gray-50">
                    <p className="text-gray-700 leading-relaxed pt-3 md:pt-4 whitespace-pre-line text-sm md:text-base">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredFaqs.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                <HelpCircle className="w-12 h-12 mx-auto mb-4" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Nenhuma pergunta encontrada
              </h3>
              <p className="text-gray-600">
                Não encontrou sua dúvida? Entre em contato conosco
              </p>
              <button
                onClick={() => navigate('/precos-form')}
                className="mt-6 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-all duration-300"
              >
                Fale Conosco
              </button>
            </div>
          )}

          {/* CTA Section */}
          <div className="mt-6 md:mt-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 md:p-8 text-center text-white">
            <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">
              Ainda tem dúvidas?
            </h3>
            <p className="text-orange-100 mb-4 md:mb-6 text-sm md:text-base">
              Nossa equipe está pronta para esclarecer todas as suas questões
            </p>
            <button
              onClick={() => navigate('/precos-form')}
              className="bg-white text-orange-600 font-bold py-2 md:py-3 px-6 md:px-8 rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-lg text-sm md:text-base"
            >
              Entre em Contato
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}