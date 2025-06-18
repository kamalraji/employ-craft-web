
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Briefcase, User } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">JobBoard</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/jobs" 
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Find Jobs
            </Link>
            <Link 
              to="/companies" 
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Companies
            </Link>
            <Link 
              to="/about" 
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              About
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin/login">
                <User className="h-4 w-4 mr-2" />
                Admin
              </Link>
            </Button>
            <Button asChild>
              <Link to="/jobs">
                Find Jobs
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
