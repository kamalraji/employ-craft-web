
import { useParams } from 'react-router-dom';
import { Header } from '@/components/header';
import { ApplicationForm } from '@/components/application-form';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useJob } from '@/hooks/useJobs';
import { MapPin, Calendar, Building, DollarSign, Clock, Users, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';

export default function JobDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: job, isLoading, error } = useJob(id!);
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="bg-gray-200 h-8 w-3/4 mb-4 rounded"></div>
            <div className="bg-gray-200 h-6 w-1/2 mb-8 rounded"></div>
            <div className="bg-gray-200 h-64 w-full rounded"></div>
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
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h1>
            <p className="text-gray-600">The job you're looking for doesn't exist or has been removed.</p>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-8">
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                  <div className="flex items-center text-gray-600 mb-4">
                    <Building className="h-5 w-5 mr-2" />
                    <span className="text-lg font-medium">{job.company}</span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {job.location}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {formatJobType(job.type)}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Posted {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge variant="secondary">{job.category}</Badge>
                  <Badge variant="outline">{formatJobType(job.type)}</Badge>
                  {job.salary && (
                    <Badge variant="outline" className="text-green-600">
                      <DollarSign className="h-3 w-3 mr-1" />
                      {job.salary}
                    </Badge>
                  )}
                </div>

                <Separator className="my-6" />

                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">Job Description</h2>
                    <div className="prose prose-gray max-w-none">
                      <p className="whitespace-pre-line text-gray-700 leading-relaxed">
                        {job.description}
                      </p>
                    </div>
                  </div>

                  {job.requirements && job.requirements.length > 0 && (
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-3">Requirements</h2>
                      <ul className="space-y-2">
                        {job.requirements.map((requirement, index) => (
                          <li key={index} className="flex items-start">
                            <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            <span className="text-gray-700">{requirement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Application Form */}
            {showApplicationForm && (
              <ApplicationForm
                jobId={job.id}
                jobTitle={job.title}
                onSuccess={() => setShowApplicationForm(false)}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {!showApplicationForm ? (
                    <Button onClick={() => setShowApplicationForm(true)} className="w-full">
                      <Users className="mr-2 h-4 w-4" />
                      Apply for this Job
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      onClick={() => setShowApplicationForm(false)} 
                      className="w-full"
                    >
                      Hide Application Form
                    </Button>
                  )}
                  
                  {job.application_url && (
                    <Button variant="outline" asChild className="w-full">
                      <a href={job.application_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Apply on Company Site
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Job Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Company</span>
                    <span className="font-medium">{job.company}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Location</span>
                    <span className="font-medium">{job.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Job Type</span>
                    <span className="font-medium">{formatJobType(job.type)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Category</span>
                    <span className="font-medium">{job.category}</span>
                  </div>
                  {job.salary && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Salary</span>
                      <span className="font-medium text-green-600">{job.salary}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500">Posted</span>
                    <span className="font-medium">
                      {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
