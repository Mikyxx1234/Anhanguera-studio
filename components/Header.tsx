import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, GraduationCap, ChevronDown, Search } from 'lucide-react';
import { polos } from '../data/polos';

export default function Header() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPolosDropdownOpen, setIsPolosDropdownOpen] = useState(false);
  const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileSearchExpanded, setIsMobileSearchExpanded] = useState(false);
  const [isDesktopSearchExpanded, setIsDesktopSearchExpanded] = useState(false);

  const menuItems = [
    { name: 'Início', path: '/' },
    { name: 'Graduação', path: '/graduacao' },
    { name: 'Pós-Graduação', path: '/pos-mba' },
    { name: 'Técnicos', path: '/cursos-tecnicos' },
    { name: 'Profissionalizantes', path: '/cursos-profissionalizantes' },
    { name: 'Blog', path: '/blog' },
    { name: 'FAQ', path: '/faq' }
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/resultados?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
      setIsMobileSearchExpanded(false);
      setIsDesktopSearchExpanded(false);
    }
  };

  const handleMobileSearchToggle = () => {
    setIsMobileSearchExpanded(!isMobileSearchExpanded);
    if (!isMobileSearchExpanded) {
      // Focus on input when expanding
      setTimeout(() => {
        const input = document.getElementById('mobile-search-input');
        if (input) input.focus();
      }, 100);
    }
  };

  const handleMobileSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const handleMobileSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/resultados?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
      setIsMobileSearchExpanded(false);
    }
  };

  // Handle hover: Show dropdown on mouse enter
  const handlePolosMouseEnter = () => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout);
      setDropdownTimeout(null);
    }
    setIsPolosDropdownOpen(true);
  };

  // Handle hover: Hide dropdown on mouse leave with delay
  const handlePolosMouseLeave = () => {
    const timeout = setTimeout(() => {
      setIsPolosDropdownOpen(false);
    }, 200); // 200ms delay before closing for smooth UX
    setDropdownTimeout(timeout);
  };

  // Close search when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.mobile-search-container') && !target.closest('.desktop-search-container')) {
        setIsMobileSearchExpanded(false);
        setIsDesktopSearchExpanded(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Toggle desktop search
  const handleDesktopSearchToggle = () => {
    setIsDesktopSearchExpanded(!isDesktopSearchExpanded);
    if (!isDesktopSearchExpanded) {
      setTimeout(() => {
        const input = document.getElementById('desktop-search-input');
        if (input) input.focus();
      }, 100);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-lg z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="https://www.soead.com.br/Logo%20Anhanguera_site_soead.png" 
              alt="Anhanguera Logo" 
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Navigation Menu */}
            <nav className="flex space-x-8">
              {menuItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `font-medium transition-colors duration-300 ${
                      isActive
                        ? 'text-orange-600 border-b-2 border-orange-600'
                        : 'text-gray-700 hover:text-orange-600'
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
              
              {/* Polos Dropdown - Hover shows dropdown, Click navigates */}
              <div
                className="relative polos-dropdown"
                onMouseEnter={handlePolosMouseEnter}
                onMouseLeave={handlePolosMouseLeave}
                role="navigation"
                aria-label="Menu de Polos"
              >
                {/* Main Polos Link - Click to navigate */}
                <Link
                  to="/polos-ead"
                  className={`font-medium transition-colors duration-300 flex items-center space-x-1 ${
                    window.location.pathname.includes('/polos-ead')
                      ? 'text-orange-600 border-b-2 border-orange-600'
                      : 'text-gray-700 hover:text-orange-600'
                  }`}
                  aria-haspopup="true"
                  aria-expanded={isPolosDropdownOpen}
                >
                  <span>Polos</span>
                </Link>

                {/* Dropdown Menu - Appears on hover */}
                {isPolosDropdownOpen && (
                  <div
                    className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 animate-fadeInUp"
                    role="menu"
                    aria-label="Lista de Polos"
                  >
                    <Link
                      to="/polos-ead"
                      onClick={() => setIsPolosDropdownOpen(false)}
                      className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors duration-300 font-medium border-b border-gray-100"
                      role="menuitem"
                    >
                      Ver Todos os Polos
                    </Link>
                    {polos.map((polo) => (
                      <Link
                        key={polo.id}
                        to={`/polos-ead/${polo.slug}`}
                        onClick={() => setIsPolosDropdownOpen(false)}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors duration-300 border-b border-gray-50 last:border-b-0"
                        role="menuitem"
                      >
                        <div className="font-medium">{polo.name}</div>
                        <div className="text-xs text-gray-500">{polo.city} - {polo.state}</div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </nav>

            {/* Mobile/Tablet Search Icon */}
            <div className="lg:hidden mobile-search-container">
              <div className="relative">
                {/* Search Icon Button */}
                <button
                  onClick={handleMobileSearchToggle}
                  className={`p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-300 ${
                    isMobileSearchExpanded ? 'bg-gray-100' : ''
                  }`}
                >
                  <Search className="w-5 h-5" />
                </button>

                {/* Expandable Search Bar */}
                <div className={`absolute top-full right-0 mt-2 transition-all duration-300 ease-in-out ${
                  isMobileSearchExpanded 
                    ? 'opacity-100 transform translate-y-0 pointer-events-auto' 
                    : 'opacity-0 transform -translate-y-2 pointer-events-none'
                }`}>
                  <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-3 w-72">
                    <form onSubmit={handleMobileSearchSubmit}>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          id="mobile-search-input"
                          type="text"
                          placeholder="Buscar cursos..."
                          value={searchTerm}
                          onChange={handleMobileSearchChange}
                          className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 text-sm"
                        />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Search Bar - Expandable */}
            <div className="hidden lg:block desktop-search-container">
              <div className="relative">
                {/* Search Icon Button */}
                <button
                  onClick={handleDesktopSearchToggle}
                  className={`p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-300 ${
                    isDesktopSearchExpanded ? 'bg-gray-100' : ''
                  }`}
                  aria-label="Buscar cursos"
                >
                  <Search className="w-5 h-5" />
                </button>

                {/* Expandable Search Bar */}
                <div className={`absolute top-full right-0 mt-2 transition-all duration-300 ease-in-out ${
                  isDesktopSearchExpanded
                    ? 'opacity-100 transform translate-y-0 pointer-events-auto'
                    : 'opacity-0 transform -translate-y-2 pointer-events-none'
                }`}>
                  <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-3 w-72">
                    <form onSubmit={handleSearchSubmit}>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          id="desktop-search-input"
                          type="text"
                          placeholder="Buscar cursos..."
                          value={searchTerm}
                          onChange={handleSearchChange}
                          className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 text-sm"
                        />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={() => navigate('/precos-form')}
            className="hidden lg:inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium text-sm rounded-lg hover:from-orange-600 hover:to-orange-700 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Inscreva-se
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-300"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-16 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
            {/* Mobile Search */}
            <div className="px-4 py-3 border-b border-gray-200 md:hidden">
              <form onSubmit={(e) => {
                e.preventDefault();
                if (searchTerm.trim()) {
                  navigate(`/resultados?q=${encodeURIComponent(searchTerm.trim())}`);
                  setSearchTerm('');
                  setIsMenuOpen(false);
                }
              }}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Buscar cursos..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 text-sm"
                  />
                </div>
              </form>
            </div>
            
            <div className="lg:hidden">
              <nav className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-gray-50 transition-colors duration-300"
                  >
                    {item.name}
                  </Link>
                ))}
                
                {/* Mobile Polos Section */}
                <Link
                  to="/polos-ead"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-gray-50 transition-colors duration-300"
                >
                  Polos
                </Link>
                
                {/* Individual Polos in Mobile */}
                <div className="pl-4 space-y-1">
                  {polos.map((polo) => (
                    <Link
                      key={polo.id}
                      to={`/polos-ead/${polo.slug}`}
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-3 py-2 rounded-md text-sm text-gray-600 hover:text-orange-600 hover:bg-gray-50 transition-colors duration-300"
                    >
                      {polo.name}
                    </Link>
                  ))}
                </div>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}