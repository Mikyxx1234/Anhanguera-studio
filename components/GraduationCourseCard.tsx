import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, GraduationCap, Star, ArrowRight, Monitor } from 'lucide-react';
import { getCourseImage, placeholderImage } from '../utils/courseImage';

interface Course {
  id: number;
  name: string;
  duration: string;
  formation: string;
  modality: string;
  area: string;
  description: string;
  price: number;
  image?: string;
  rating?: number;
  badge?: string;
}

interface GraduationCourseCardProps {
  course: Course;
  onViewPrice: (course: Course) => void;
  category: string;
  key?: React.Key;
}

export default function GraduationCourseCard({ course, onViewPrice, category }: GraduationCourseCardProps) {
  const initialSrc = getCourseImage(course);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const fb = placeholderImage(`${course.id}-${course.name}`);
    if (img.src !== fb) {
      img.src = fb;
    }
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 group transition-all duration-300 hover:border-orange-500/20 hover:shadow-2xl hover:shadow-orange-500/5 flex flex-col h-full shadow-sm">
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-orange-100 to-orange-200">
        <img 
          src={initialSrc}
          alt={course.name}
          loading="lazy"
          onError={handleImageError}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {course.badge && (
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm ${
              course.badge === 'Top 1' ? 'bg-yellow-400 text-black' : 'bg-orange-500 text-white'
            }`}>
              {course.badge}
            </span>
          )}
        </div>
        
        {course.rating && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 border border-white shadow-sm">
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            <span className="text-gray-900 text-xs font-bold">{course.rating.toFixed(1)}</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent opacity-60"></div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-black tracking-[0.2em] text-orange-600 uppercase">{course.area}</span>
          <span className="text-[10px] font-bold text-gray-400 uppercase">{course.formation}</span>
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight group-hover:text-orange-600 transition-colors">
          {course.name}
        </h3>
        
        <p className="text-gray-600 text-xs leading-relaxed mb-4 line-clamp-2">
          {course.description}
        </p>
        
        <div className="mt-auto space-y-3">
          <div className="flex items-center gap-4 py-3 border-y border-gray-50 flex-wrap">
            <div className="flex items-center gap-1.5 text-gray-400">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-[11px] font-medium">{course.duration}</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-400">
              <Monitor className="w-3.5 h-3.5" />
              <span className="text-[11px] font-medium">{course.modality}</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-400">
              <GraduationCap className="w-3.5 h-3.5" />
              <span className="text-[11px] font-medium">{course.formation}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => onViewPrice(course)}
              className="px-4 py-2 rounded-lg border border-orange-500 text-orange-600 text-xs font-bold hover:bg-orange-500 hover:text-white transition-all focus:outline-none"
            >
              Ver preço
            </button>
            <Link 
              to={`/curso/${category}/${course.id}`}
              className="flex items-center gap-1 text-xs font-bold text-gray-600 hover:text-orange-600 transition-colors group/link"
            >
              Ver curso
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
