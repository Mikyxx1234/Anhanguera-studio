import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import BackToTopButton from './components/BackToTopButton';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import GraduationPage from './pages/GraduationPage';
import PosMBAPage from './pages/PosMBAPage';
import PolosEADPage from './pages/PolosEADPage';
import PoloDetailPage from './pages/PoloDetailPage';
import PrecosFormPage from './pages/PrecosFormPage';
import FAQPage from './pages/FAQPage';
import TechnicalCoursesPage from './pages/TechnicalCoursesPage';
import ProfessionalCoursesPage from './pages/ProfessionalCoursesPage';
import NotFoundPage from './pages/NotFoundPage';
import SearchResultsPage from './pages/SearchResultsPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import CourseDetailPage from './pages/CourseDetailPage';
import { useSessionTracker } from './hooks/useSessionTracker';

function SessionTracker() {
  useSessionTracker();
  return null;
}

export default function App() {
  return (
    <Router>
      <SessionTracker />
      <ScrollToTop />
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/graduacao" element={<GraduationPage />} />
            <Route path="/pos-mba" element={<PosMBAPage />} />
            <Route path="/cursos-tecnicos" element={<TechnicalCoursesPage />} />
            <Route path="/cursos-profissionalizantes" element={<ProfessionalCoursesPage />} />
            <Route path="/polos-ead" element={<PolosEADPage />} />
            <Route path="/polos-ead/:poloSlug" element={<PoloDetailPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/precos-form" element={<PrecosFormPage />} />
            <Route path="/curso/:category/:id" element={<CourseDetailPage />} />
            <Route path="/resultados" element={<SearchResultsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
        <WhatsAppButton />
        <BackToTopButton />
      </div>
    </Router>
  );
}