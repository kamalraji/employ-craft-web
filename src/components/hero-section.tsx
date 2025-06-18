
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Briefcase, Users, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export function HeroSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (location) params.set('location', location);
    
    router.push(`/jobs?${params.toString()}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Find Your Dream Job
            <span className="block text-blue-600">Today</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover thousands of job opportunities from top companies. Start your career journey with us.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-5 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Job title, keywords, or company"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-12 h-14 text-base border-0 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-4 relative">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="City, state, or remote"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-12 h-14 text-base border-0 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-3">
                <Button 
                  onClick={handleSearch}
                  className="w-full h-14 text-base font-semibold bg-blue-600 hover:bg-blue-700"
                >
                  Search Jobs
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Briefcase className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">10,000+</h3>
            <p className="text-gray-600">Active Jobs</p>
          </div>
          <div className="text-center bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">5,000+</h3>
            <p className="text-gray-600">Companies</p>
          </div>
          <div className="text-center bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">95%</h3>
            <p className="text-gray-600">Success Rate</p>
          </div>
        </div>

        {/* Popular Categories */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-semibold text-gray-900 mb-8">Popular Categories</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {['Technology', 'Marketing', 'Design', 'Sales', 'Finance', 'Healthcare', 'Education', 'Operations'].map((category) => (
              <Link
                key={category}
                href={`/jobs?category=${encodeURIComponent(category)}`}
                className="bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-full px-6 py-3 text-gray-700 hover:text-blue-700 transition-all duration-200 font-medium"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
