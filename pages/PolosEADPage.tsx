import React from 'react';
import { MapPin, ChevronRight } from 'lucide-react';
import { polos } from '../data/polos';
import SEOHead from '../components/SEOHead';
import Breadcrumb from '../components/Breadcrumb';
import { useNavigate } from 'react-router-dom';

export default function PolosEADPage() {
  const navigate = useNavigate();

  // Estado para controlar qual polo está sendo exibido no mapa
  const [selectedPoloIndex, setSelectedPoloIndex] = React.useState(0);
  
  // Função para criar URL do mapa do polo selecionado
  const getMapUrl = (index: number) => {
    const polo = polos[index];
    // Usar coordenadas para centralizar o mapa corretamente
    const { lat, lng } = polo.coordinates;
    return `https://maps.google.com/maps?q=${lat},${lng}&hl=pt-BR&z=16&output=embed`;
  };

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <SEOHead
        title="Nossos Polos - Anhanguera"
        description="Encontre o polo Anhanguera mais próximo de você. 5 polos acadêmicos em São Paulo com toda infraestrutura para sua formação."
        path="/polos-ead"
        image="/Bg_polos banner.png"
      />

      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'Polos' }]} />

      {/* Header */}
      <section
        className="py-8 md:py-16"
        style={{
          backgroundImage: `url('/Bg_polos banner.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <h1 className="text-2xl md:text-5xl font-bold text-white">
              Nossos Polos
            </h1>
          </div>
          <p className="text-base md:text-xl text-blue-100 max-w-2xl mx-auto">
            Encontre o polo mais próximo de você e venha fazer parte da nossa comunidade acadêmica
          </p>
        </div>
      </section>

      {/* Seção de Mapa e Endereços */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Coluna Esquerda - Google Maps */}
            <div className="order-1 lg:order-1">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-[600px] md:h-[700px] lg:h-[800px] sticky top-24">
                {/* Header do Mapa */}
                <div className="p-4 bg-orange-500 text-white">
                  <p className="text-sm font-semibold">
                    📍 {polos[selectedPoloIndex].name}
                  </p>
                  <p className="text-xs opacity-90">
                    {polos[selectedPoloIndex].address}, {polos[selectedPoloIndex].city}
                  </p>
                </div>
                
                {/* Navegação entre polos */}
                <div className="bg-orange-50 px-4 py-2 flex items-center justify-between border-b">
                  <button
                    onClick={() => setSelectedPoloIndex((prev) => (prev === 0 ? polos.length - 1 : prev - 1))}
                    className="text-orange-600 hover:text-orange-700 font-semibold text-sm"
                  >
                    ← Anterior
                  </button>
                  <span className="text-sm text-gray-600">
                    {selectedPoloIndex + 1} de {polos.length}
                  </span>
                  <button
                    onClick={() => setSelectedPoloIndex((prev) => (prev === polos.length - 1 ? 0 : prev + 1))}
                    className="text-orange-600 hover:text-orange-700 font-semibold text-sm"
                  >
                    Próximo →
                  </button>
                </div>
                
                {/* Mapa */}
                <iframe
                  key={selectedPoloIndex}
                  src={getMapUrl(selectedPoloIndex)}
                  width="100%"
                  height="calc(100% - 100px)"
                  style={{ border: 0, minHeight: '600px' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Mapa do ${polos[selectedPoloIndex].name}`}
                  className="w-full"
                />
              </div>
            </div>

            {/* Coluna Direita - Lista de Endereços */}
            <div className="order-2 lg:order-2">
              <div className="space-y-6">
                {polos.map((polo, index) => (
                  <div
                    key={polo.id}
                    onClick={() => setSelectedPoloIndex(index)}
                    className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border-l-4 cursor-pointer ${
                      selectedPoloIndex === index 
                        ? 'border-orange-600 ring-2 ring-orange-300 bg-orange-50' 
                        : 'border-orange-500'
                    }`}
                  >
                    {/* Nome do Polo - Clicável */}
                    <div className="w-full text-left mb-3 flex items-center justify-between">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/polos-ead/${polo.slug}`);
                        }}
                        className="group flex items-center gap-2 hover:text-orange-600 transition-colors duration-200"
                      >
                        <span className="flex items-center justify-center w-8 h-8 bg-orange-500 text-white rounded-full text-sm font-bold">
                          {index + 1}
                        </span>
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-orange-600">
                          {polo.name}
                        </h3>
                      </button>
                      <ChevronRight className="w-5 h-5 text-orange-500" />
                    </div>

                    {/* Endereço Completo */}
                    <div className="flex items-start space-x-3 mb-3">
                      <MapPin className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-gray-700 font-medium">{polo.address}</p>
                        <p className="text-gray-600 text-sm">{polo.city} - {polo.state}</p>
                      </div>
                    </div>

                    {/* Link "Saiba mais" */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/polos-ead/${polo.slug}`);
                      }}
                      className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium text-sm gap-1 group/link"
                    >
                      <span>Saiba mais sobre este polo</span>
                      <ChevronRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-200" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final - Faça sua Inscrição */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Pronto para começar sua jornada?
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Escolha o polo mais próximo e transforme seu futuro com a Anhanguera.
            Estamos prontos para receber você!
          </p>
          <button
            onClick={() => navigate('/precos-form')}
            className="inline-flex items-center gap-3 bg-white text-orange-600 font-bold text-lg px-10 py-5 rounded-full hover:bg-gray-50 hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-3xl"
          >
            <span>Inscreva-se agora</span>
            <ChevronRight className="w-6 h-6" />
          </button>
          <p className="text-white/80 text-sm mt-6">
            Processo 100% online • Matrícula facilitada • Comece já!
          </p>
        </div>
      </section>
    </div>
  );
}