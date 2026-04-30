import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Instagram, Facebook } from 'lucide-react';

export default function Footer() {
  const [showPrivacyModal, setShowPrivacyModal] = React.useState(false);
  const [showTermsModal, setShowTermsModal] = React.useState(false);

  const quickLinks = [
    { label: 'Graduação', path: '/graduacao' },
    { label: 'Pós-Graduação', path: '/pos-mba' },
    { label: 'Cursos Técnicos', path: '/cursos-tecnicos' },
    { label: 'Polos', path: '/polos-ead' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Contato', path: '/precos-form' }
  ];

  const PrivacyModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Política de Privacidade</h3>
          <button
            onClick={() => setShowPrivacyModal(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-300"
          >
            ×
          </button>
        </div>
        <div className="p-6 space-y-4">

          <h4 className="font-semibold text-gray-900">SOEAD SERVIÇOS DE INTERMEDIAÇÃO E CONSULTORIA LTDA</h4>
          <p className="text-gray-700 text-sm">
            Razão Social: SOEAD SERVIÇOS DE INTERMEDIAÇÃO E CONSULTORIA LTDA<br />
 CNPJ: 40.934.017/0001-30 <br />
 Ano de fundação: 2021 <br />
A SOEAD respeita a privacidade dos visitantes de seu site e se compromete a proteger os dados pessoais fornecidos. Esta Política de Privacidade descreve como os dados são coletados, utilizados e protegidos. <br />
Última atualização: 23/09/2025
          </p>
          
          <h4 className="font-semibold text-gray-900">1. Coleta de Informações</h4>
          <p className="text-gray-700 text-sm">
            A SOEAD coleta informações exclusivamente quando o visitante preenche, de forma voluntária, os formulários disponibilizados em seu site. <br />
 Os dados podem incluir: nome, e-mail, telefone, empresa e informações fornecidas pelo próprio visitante.
          </p>
          
          <h4 className="font-semibold text-gray-900">2. Uso das Informações</h4>
          <p className="text-gray-700 text-sm">
            As informações coletadas são utilizadas para: <br />
- Entrar em contato em resposta às solicitações feitas pelo visitante; <br />
- Fornecer informações sobre nossos serviços; <br />
- Melhorar a comunicação entre a SOEAD e seus clientes e parceiros. <br />

          </p>
          
          <h4 className="font-semibold text-gray-900">3. Compartilhamento de Dados</h4>
          <p className="text-gray-700 text-sm">
            A SOEAD garante que não vende, não aluga e não comercializa os dados pessoais coletados.
 O compartilhamento só ocorrerá quando: <br />
- Necessário para cumprir determinações legais ou regulatórias; <br />
- Exigido por autoridades competentes.
          </p>
          
          <h4 className="font-semibold text-gray-900">4. Armazenamento e Segurança</h4>
          <p className="text-gray-700 text-sm">
            Os dados fornecidos são armazenados em ambiente seguro e acessados apenas por profissionais autorizados, adotando medidas razoáveis para proteger contra perda, uso indevido ou acesso não autorizado.
          </p>
          
          <h4 className="font-semibold text-gray-900">5. Cookies e Tecnologias</h4>
          <p className="text-gray-700 text-sm">
            O site pode utilizar cookies apenas para melhorar a navegação e a experiência do usuário. O visitante pode desativar o uso de cookies nas configurações de seu navegador.
          </p>

          <h4 className="font-semibold text-gray-900">6. Alterações desta Política</h4>
          <p className="text-gray-700 text-sm">
            A SOEAD poderá atualizar esta Política de Privacidade periodicamente. A versão atualizada estará sempre disponível neste site.
          </p>
        </div>
      </div>
    </div>
  );

  const TermsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Termos de Uso</h3>
          <button
            onClick={() => setShowTermsModal(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-300"
          >
            ×
          </button>
        </div>
        <div className="p-6 space-y-4">
          <h4 className="font-semibold text-gray-900">Formulários do Site da SOEAD</h4>
          <p className="text-gray-700 text-sm">
            SOEAD SERVIÇOS DE INTERMEDIAÇÃO E CONSULTORIA LTDA <br />
 CNPJ: 40.934.017/0001-30 Última atualização: 23/09/2025 <br />
Ao preencher e enviar qualquer formulário disponível neste site, você declara estar ciente e de acordo com os seguintes termos:
          </p>

          <h4 className="font-semibold text-gray-900">1. Finalidade do Formulário</h4>
          <p className="text-gray-700 text-sm">
            Os formulários disponibilizados no site têm como objetivo exclusivo:<br />
<br /> - Permitir o contato entre a SOEAD e o visitante;<br />
- Viabilizar o envio de informações sobre serviços, propostas e esclarecimentos;<br />
- Facilitar a comunicação em relação a solicitações voluntárias feitas pelo usuário.
          </p>
          
          <h4 className="font-semibold text-gray-900">2. Fornecimento Voluntário de Dados</h4>
          <p className="text-gray-700 text-sm">
            - O preenchimento dos formulários é opcional e voluntário;<br />
- Ao enviar seus dados, você concorda que eles sejam utilizados para as finalidades descritas neste termo e em nossa Política de Privacidade.
          </p>
          
          <h4 className="font-semibold text-gray-900">3. Responsabilidade do Usuário</h4>
          <p className="text-gray-700 text-sm">
            - É responsabilidade do usuário garantir que os dados informados são verdadeiros, completos e atualizados;<br />
- A SOEAD não se responsabiliza por informações incorretas, incompletas ou falsas fornecidas pelo usuário.
          </p>
          
          <h4 className="font-semibold text-gray-900">4. Uso das Informações</h4>
          <p className="text-gray-700 text-sm">
           - Os dados informados serão utilizados apenas para responder às solicitações do usuário, prestar informações e manter comunicação direta com a SOEAD;<br />
- Os dados não serão vendidos, alugados ou compartilhados com terceiros para fins comerciais.
          </p>
          
          <h4 className="font-semibold text-gray-900">5. Direitos da SOEAD</h4>
          <p className="text-gray-700 text-sm">
           A SOEAD reserva-se o direito de:<br />
          <br /> - Contatar o usuário utilizando os dados fornecidos;<br />
- Não responder mensagens que contenham informações inverídicas, ofensivas ou em desacordo com a finalidade dos formulários;<br />
- Alterar este Termo de Uso a qualquer momento, mediante publicação da versão atualizada em nosso site.
          </p>
          
          <h4 className="font-semibold text-gray-900">6. Aceite</h4>
          <p className="text-gray-700 text-sm">
           Ao clicar em “Enviar” no formulário, o usuário declara ter lido, compreendido e aceitado integralmente este Termo de Uso e a Política de Privacidade da SOEAD.
          </p>
        </div>
      </div>
    </div>
  );
  return (
    <>
      <footer className="text-white" style={{ backgroundColor: '#16375CFF' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 items-center md:items-start">
          {/* Logo e Descrição */}
          <div className="space-y-2 md:space-y-4 flex flex-col items-center md:items-start">
            <div className="flex items-center space-x-2">
              <img 
                src="/Logo Anhanguera_site_soead_branca.png" 
                alt="Anhanguera Logo" 
                className="h-12 md:h-16 w-auto"
              />
            </div>
            
            {/* Quick Links - Desktop Only */}
            <div className="hidden md:block">
              <div className="flex flex-wrap gap-x-3 md:gap-x-4 gap-y-1 md:gap-y-2">
                <Link to="/" className="text-gray-300 hover:text-white transition-colors duration-300 text-sm">Início</Link>
                <Link to="/graduacao" className="text-gray-300 hover:text-white transition-colors duration-300 text-sm">Graduação</Link>
                <Link to="/pos-mba" className="text-gray-300 hover:text-white transition-colors duration-300 text-sm">Pós-Graduação</Link>
                <Link to="/cursos-tecnicos" className="text-gray-300 hover:text-white transition-colors duration-300 text-sm">Cursos Técnicos</Link>
                <Link to="/polos-ead" className="text-gray-300 hover:text-white transition-colors duration-300 text-sm">Polos</Link>
                <Link to="/faq" className="text-gray-300 hover:text-white transition-colors duration-300 text-sm">FAQ</Link>
              </div>
            </div>
          </div>

          {/* Empty column for spacing */}
          <div></div>

          {/* Contato */}
          <div className="text-center md:text-left">
            <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-4">Contato</h3>
            <ul className="space-y-2 md:space-y-3">
              <li className="flex items-center justify-center md:justify-start space-x-3">
                <Phone className="w-4 h-4 text-orange-500" />
                <a 
                  href="https://wa.me/5511992793249" 
                  className="text-gray-400 text-sm hover:text-white transition-colors duration-300"
                >
                  Acadêmico: (11) 99279-3249
                </a>
              </li>
              <li className="flex items-center justify-center md:justify-start space-x-3">
                <Phone className="w-4 h-4 text-orange-500" />
                <a 
                  href="https://wa.me/5511992793249" 
                  className="text-gray-400 text-sm hover:text-white transition-colors duration-300"
                >
                  Comercial: (11) 99279-3249
                </a>
              </li>
              
              {/* Quick Links - Mobile Only */}
              <div className="md:hidden mt-3 space-y-1">
                <li><Link to="/" className="text-gray-300 hover:text-white transition-colors duration-300">Início</Link></li>
                <li><Link to="/graduacao" className="text-gray-300 hover:text-white transition-colors duration-300">Graduação</Link></li>
                <li><Link to="/pos-mba" className="text-gray-300 hover:text-white transition-colors duration-300">Pós-Graduação</Link></li>
                <li><Link to="/cursos-tecnicos" className="text-gray-300 hover:text-white transition-colors duration-300">Cursos Técnicos</Link></li>
                <li><Link to="/polos-ead" className="text-gray-300 hover:text-white transition-colors duration-300">Polos</Link></li>
                <li><Link to="/faq" className="text-gray-300 hover:text-white transition-colors duration-300">FAQ</Link></li>
              </div>
            </ul>
            
            {/* Social media icons moved below phone numbers */}
            <div className="flex justify-center md:justify-start space-x-3 md:space-x-4 mt-3 md:mt-4">
              <a href="https://www.instagram.com/poloanhanguera.saopaulo/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-500 transition-colors duration-300">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://www.facebook.com/profile.php?id=61567168900104#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-500 transition-colors duration-300">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-3 md:mt-4 pt-3 md:pt-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 Anhanguera. Todos os direitos reservados.
          </p>
          <div className="flex justify-center space-x-4 md:space-x-6 mt-2 md:mt-0">
            <button 
              onClick={() => setShowPrivacyModal(true)}
              className="text-gray-400 hover:text-orange-500 text-sm transition-colors duration-300"
            >
              Política de Privacidade
            </button>
            <button 
              onClick={() => setShowTermsModal(true)}
              className="text-gray-400 hover:text-orange-500 text-sm transition-colors duration-300"
            >
              Termos de Uso
            </button>
          </div>
        </div>
      </div>
      </footer>
      
      {/* Modals */}
      {showPrivacyModal && <PrivacyModal />}
      {showTermsModal && <TermsModal />}
    </>
  );
}