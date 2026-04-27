import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Phone, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { getPoloBySlug } from '../data/polos';
import SEOHead from '../components/SEOHead';
import Breadcrumb from '../components/Breadcrumb';

export default function PoloDetailPage() {
  const { poloSlug } = useParams<{ poloSlug: string }>();
  const navigate = useNavigate();
  const polo = getPoloBySlug(poloSlug);

  if (!polo) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Polo não encontrado</h1>
          <button
            onClick={() => navigate('/polos-ead')}
            className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-all duration-300"
          >
            Voltar para Polos
          </button>
        </div>
      </div>
    );
  }

  const handlePhoneClick = (phone: string) => {
    window.open(`https://api.whatsapp.com/send?phone=55${phone.replace(/\D/g, '')}`, '_blank');
  };

  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dOWTgaQzuU17R8&q=${encodeURIComponent(polo.fullAddress)}&zoom=16`;

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <SEOHead
        title={`${polo.name} - Anhanguera`}
        description={`Conheça o ${polo.name} da Anhanguera em ${polo.city}. ${polo.description}`}
        path={`/polo/${polo.slug}`}
        image={polo.image}
      />
      
      {/* Breadcrumb */}
      <Breadcrumb 
        items={[
          { label: 'Polos', path: '/polos-ead' },
          { label: polo.name }
        ]} 
      />
      
      {/* Back Button */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/polos-ead')}
            className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 transition-colors duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Voltar para Polos</span>
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <img
          src={polo.image}
          alt={polo.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {polo.name}
            </h1>
            <p className="text-base md:text-lg text-white/90">
              {polo.city} - {polo.state}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-white py-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Academic Phone */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contato Acadêmico</h3>
              <button
                onClick={() => handlePhoneClick(polo.academicPhone)}
                className="border-2 border-orange-500 text-orange-500 font-bold py-4 px-8 rounded-lg hover:bg-orange-500 hover:text-white transition-all duration-300 shadow-lg inline-flex items-center space-x-2"
              >
                <Phone className="w-5 h-5" />
                <span>{polo.academicPhone}</span>
              </button>
            </div>

            {/* Commercial Phone */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contato Comercial</h3>
              <button
                onClick={() => handlePhoneClick(polo.commercialPhone)}
                className="border-2 border-orange-500 text-orange-500 font-bold py-4 px-8 rounded-lg hover:bg-orange-500 hover:text-white transition-all duration-300 shadow-lg inline-flex items-center space-x-2"
              >
                <Phone className="w-5 h-5" />
                <span>{polo.commercialPhone}</span>
              </button>
            </div>

            {/* Address */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Endereço</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-start justify-center space-x-2">
                  <MapPin className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {polo.fullAddress}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Description */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Sobre o {polo.name}
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-8">
                {polo.description}
              </p>
            </div>

            {/* Map */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Localização
              </h3>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden h-64 md:h-96">
                <iframe
                  src={`https://www.google.com/maps?q=${encodeURIComponent(polo.fullAddress )}&output=embed`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                  title={`Mapa do ${polo.name}`}
                />
              </div>
              
              {/* Map Footer */}
              <div className="mt-4 text-center">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(polo.fullAddress)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-orange-600 hover:text-orange-700 font-medium transition-colors duration-300"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Ver no Google Maps</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 py-12">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Pronto para começar sua jornada?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Entre em contato conosco e descubra como podemos ajudar você a alcançar seus objetivos
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/precos-form')}
              className="bg-white text-orange-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-lg"
            >
              Fazer Inscrição
            </button>
            <button
              onClick={() => navigate('/graduacao')}
              className="border-2 border-white text-white font-bold py-3 px-8 rounded-lg hover:bg-white hover:text-orange-600 transition-all duration-300"
            >
              Ver Cursos
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}