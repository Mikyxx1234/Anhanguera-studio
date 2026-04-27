import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="bg-gray-50 border-b border-gray-200 py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ol className="flex items-center space-x-2 text-sm">
          {/* Home */}
          <li>
            <Link
              to="/"
              className="flex items-center text-gray-500 hover:text-orange-600 transition-colors duration-300"
            >
              <Home className="w-4 h-4" />
              <span className="ml-1">Início</span>
            </Link>
          </li>
          
          {/* Breadcrumb Items */}
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
              {item.path && index < items.length - 1 ? (
                <Link
                  to={item.path}
                  className="text-gray-500 hover:text-orange-600 transition-colors duration-300"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-gray-900 font-medium">
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}