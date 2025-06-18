
import { useState } from 'react';
import { Header } from '@/components/header';
import { JobCard } from '@/components/job-card';
import { JobFilters } from '@/components/job-filters';
import { Button } from '@/components/ui/button';
import { useJobs } from '@/hooks/useJobs';
import { JobFilters as JobFiltersType } from '@/types/job';
import { Loader2, Grid, List } from 'lucide-react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function JobsPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<JobFiltersType>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Initialize filters from URL params
  useEffect(() => {
    if (router.isReady) {
      const urlFilters: JobFiltersType = {};
      
      if (router.query.search) urlFilters.search = router.query.search as string;
      if (router.query.category) urlFilters.category = router.query.category as string;
      if (router.query.type) urlFilters.type = router.query.type as any;
      if (router.query.location) urlFilters.location = router.query.location as string;
      if (router.query.sortBy) urlFilters.sortBy = router.query.sortBy as any;
      if (router.query.sortOrder) urlFilters.sortOrder = router.query.sortOrder as any;
      
      setFilters(urlFilters);
    }
  }, [router.isReady, router.query]);

  const { data: jobsData, isLoading, error } = useJobs(filters, currentPage);

  const handleFiltersChange = (newFilters: JobFiltersType) => {
    setFilters(newFilters);
    setCurrentPage(1);
    
    // Update URL with new filters
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) params.set(key, value.toString());
    });
    
    router.push(`/jobs?${params.toString()}`, undefined, { shallow: true });
  };

  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-6">Unable to load jobs. Please try again later.</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Next Job</h1>
          <p className="text-gray-600">Discover opportunities that match your skills and interests</p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <JobFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            totalJobs={jobsData?.total || 0}
          />
        </div>

        {/* View Mode Toggle */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">View:</span>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Jobs Grid/List */}
        {isLoading && currentPage === 1 ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : jobsData?.data.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search criteria to find more opportunities.</p>
            <Button onClick={() => handleFiltersChange({})}>
              Clear All Filters
            </Button>
          </div>
        ) : (
          <>
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
              : "space-y-4 mb-8"
            }>
              {jobsData?.data.map((job) => (
                <JobCard 
                  key={job.id} 
                  job={job} 
                  compact={viewMode === 'list'}
                />
              ))}
            </div>

            {/* Load More */}
            {jobsData && currentPage < jobsData.totalPages && (
              <div className="text-center">
                <Button
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Load More Jobs'
                  )}
                </Button>
                <p className="text-sm text-gray-500 mt-2">
                  Showing {jobsData.data.length} of {jobsData.total} jobs
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
