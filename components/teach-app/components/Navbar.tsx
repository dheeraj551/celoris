import { Link } from 'react-router-dom';
import { BookOpen, Search, Menu, X, User } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="border-b border-gray-100 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-emerald-600 p-1.5 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">Celoris</span>
            </Link>
            
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link to="/trainers" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">
                Find Trainers
              </Link>
              <Link to="/courses" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">
                Browse Courses
              </Link>
              <Link to="/about" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">
                About Us
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search skills, trainers..." 
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent w-64 bg-gray-50"
              />
            </div>
            <Link to="/login" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
              Log in
            </Link>
            <Link to="/register" className="bg-emerald-600 text-white hover:bg-emerald-700 px-4 py-2 rounded-full text-sm font-medium transition-colors">
              Sign up
            </Link>
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-500 hover:text-gray-900 p-2"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/trainers" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md">
              Find Trainers
            </Link>
            <Link to="/courses" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md">
              Browse Courses
            </Link>
            <Link to="/login" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md">
              Log in
            </Link>
            <Link to="/register" className="block px-3 py-2 text-base font-medium text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-md">
              Sign up
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
