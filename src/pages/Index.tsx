
import { Header } from '@/components/header';
import { HeroSection } from '@/components/hero-section';
import { JobCard } from '@/components/job-card';
import { Button } from '@/components/ui/button';
import { useJobs } from '@/hooks/useJobs';
import { ArrowRight, Star, Clock, Shield } from 'lucide-react';
import Link from 'next/link';

const Index = () => {
  const { data: jobsData, isLoading } = useJobs({}, 1);

  const features = [
    {
      icon: <Star className="h-6 w-6 text-yellow-500" />,
      title: "Quality Jobs",
      description: "Hand-picked opportunities from top employers"
    },
    {
      icon: <Clock className="h-6 w-6 text-blue-500" />,
      title: "Real-time Updates",
      description: "Latest job postings updated every hour"
    },
    {
      icon: <Shield className="h-6 w-6 text-green-500" />,
      title: "Verified Companies",
      description: "All employers are verified and trusted"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <HeroSection />
      
      {/* Featured Jobs Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Jobs</h2>
            <p className="text-xl text-gray-600">Discover the latest opportunities from top companies</p>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-64 animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {jobsData?.data.slice(0, 6).map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
              
              <div className="text-center">
                <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/jobs">
                    View All Jobs
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our Platform?</h2>
            <p className="text-xl text-gray-600">We make job searching simple and effective</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Find Your Dream Job?</h2>
          <p className="text-xl text-blue-100 mb-8">Join thousands of professionals who found their perfect role</p>
          <Button asChild size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
            <Link href="/jobs">
              Start Your Search
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">JobBoard</h3>
              <p className="text-gray-300">Find your dream job with the leading job search platform.</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">For Job Seekers</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="/jobs" className="hover:text-white">Browse Jobs</Link></li>
                <li><Link href="/companies" className="hover:text-white">Companies</Link></li>
                <li><Link href="/salary" className="hover:text-white">Salary Guide</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">For Employers</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="/post-job" className="hover:text-white">Post a Job</Link></li>
                <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link href="/admin" className="hover:text-white">Admin Panel</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="/about" className="hover:text-white">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2024 JobBoard. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
