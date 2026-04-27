import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import Breadcrumb from '../components/Breadcrumb';

export default function NotFoundPage() {
  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <SEOHead
        title="Página não encontrada - Anhanguera"
        description="A página que você está procurando não foi encontrada. Volte para a página inicial ou explore nossos cursos."
        path="/404"
      />
      
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'Página não encontrada' }]} />
      
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-xl shadow-xl p-12">
            <div className="text-orange-500 mb-6">
              <Search className="w-20 h-20 mx-auto" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Página não encontrada
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              A página que você está procurando não existe ou foi movida.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/"
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-3 px-6 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 inline-flex items-center justify-center space-x-2"
              >
                <Home className="w-5 h-5" />
                <span>Voltar ao Início</span>
              </Link>
              <Link
                to="/graduacao"
                className="border-2 border-orange-600 text-orange-600 font-bold py-3 px-6 rounded-lg hover:bg-orange-600 hover:text-white transition-all duration-300"
              >
                Ver Cursos
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}