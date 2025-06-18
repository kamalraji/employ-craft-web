
import { useRouter } from 'next/router';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useJob } from '@/hooks/useJobs';
import { 
  MapPin, 
  Calendar, 
  Building, 
  DollarSign, 
  ExternalLink,
  ArrowLeft,
  Clock,
  Users,
  CheckCircle
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function JobDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: job, isLoading, error } = useJob(id as string);

  if (!mounted) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h2>
            <p className="text-gray-600 mb-6">The job you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link href="/jobs">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Jobs
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const formatJobType = (type: string) => {
    return type.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/jobs">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Jobs
          </Link>
        </Button>

        {/* Job Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{job.title}</h1>
                
                <div className="flex items-center space-x-6 text-gray-600 mb-6">
                  <div className="flex items-center">
                    <Building className="h-5 w-5 mr-2" />
                    <span className="font-medium text-lg">{job.company}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span>Posted {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mb-6">
                  <Badge variant="default" className="text-sm">
                    {formatJobType(job.type)}
                  </Badge>
                  <Badge variant="secondary" className="text-sm">
                    {job.category}
                  </Badge>
                  {job.salary && (
                    <Badge variant="outline" className="text-sm">
                      <DollarSign className="h-3 w-3 mr-1" />
                      {job.salary}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="lg:text-right space-y-3">
                {job.application_url && (
                  <Button size="lg" className="w-full lg:w-auto bg-blue-600 hover:bg-blue-700">
                    <a href={job.application_url} target="_blank" rel="noopener noreferrer" className="flex items-center">
                      Apply Now
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                )}
                <Button variant="outline" size="lg" className="w-full lg:w-auto">
                  <Users className="mr-2 h-4 w-4" />
                  Save Job
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Description */}
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Job Description</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{job.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            {job.requirements.length > 0 && (
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">Requirements</h2>
                  <ul className="space-y-3">
                    {job.requirements.map((requirement, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Job Type</span>
                    <Badge variant="secondary">{formatJobType(job.type)}</Badge>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Category</span>
                    <span className="font-medium">{job.category}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Location</span>
                    <span className="font-medium">{job.location}</span>
                  </div>
                  {job.salary && (
                    <>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Salary</span>
                        <span className="font-medium text-green-600">{job.salary}</span>
                      </div>
                    </>
                  )}
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Posted</span>
                    <span className="font-medium">
                      {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Company Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">About {job.company}</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Building className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="font-medium">{job.company}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-600">{job.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-600">Recently active</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Apply Card */}
            {job.application_url && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-6 text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Apply?</h3>
                  <p className="text-gray-600 mb-4">Don't miss out on this opportunity!</p>
                  <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
                    <a href={job.application_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                      Apply Now
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
