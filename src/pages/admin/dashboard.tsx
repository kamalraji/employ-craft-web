
import { useState } from 'react';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useJobs } from '@/hooks/useJobs';
import { useApplications } from '@/hooks/useApplications';
import { useCompanies } from '@/hooks/useCompanies';
import { BarChart3, Briefcase, Building, Users, Mail, Phone, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function AdminDashboard() {
  const { data: jobsData } = useJobs({}, 1);
  const { data: applications } = useApplications();
  const { data: companies } = useCompanies();

  const stats = [
    {
      title: 'Total Jobs',
      value: jobsData?.total || 0,
      icon: <Briefcase className="h-6 w-6 text-blue-600" />,
    },
    {
      title: 'Companies',
      value: companies?.length || 0,
      icon: <Building className="h-6 w-6 text-green-600" />,
    },
    {
      title: 'Applications',
      value: applications?.length || 0,
      icon: <Users className="h-6 w-6 text-purple-600" />,
    },
    {
      title: 'Active Jobs',
      value: jobsData?.data.filter(job => job.status === 'ACTIVE').length || 0,
      icon: <BarChart3 className="h-6 w-6 text-orange-600" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
          <p className="text-xl text-gray-600">Manage your job board</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  {stat.icon}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs for different sections */}
        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList>
            <TabsTrigger value="applications">Recent Applications</TabsTrigger>
            <TabsTrigger value="jobs">Manage Jobs</TabsTrigger>
            <TabsTrigger value="companies">Companies</TabsTrigger>
          </TabsList>

          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <CardTitle>Recent Job Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {applications?.slice(0, 10).map((application) => (
                    <div key={application.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{application.applicant_name}</h4>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <Mail className="h-4 w-4 mr-1" />
                            {application.applicant_email}
                          </div>
                          {application.applicant_phone && (
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <Phone className="h-4 w-4 mr-1" />
                              {application.applicant_phone}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <Badge variant={application.status === 'pending' ? 'secondary' : 'default'}>
                            {application.status}
                          </Badge>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDistanceToNow(new Date(application.created_at), { addSuffix: true })}
                          </div>
                        </div>
                      </div>
                      {application.cover_letter && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {application.cover_letter}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="jobs">
            <Card>
              <CardHeader>
                <CardTitle>Job Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {jobsData?.data.slice(0, 10).map((job) => (
                    <div key={job.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{job.title}</h4>
                          <p className="text-sm text-gray-600">{job.company}</p>
                          <p className="text-sm text-gray-500">{job.location}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={job.status === 'ACTIVE' ? 'default' : 'secondary'}>
                            {job.status}
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="companies">
            <Card>
              <CardHeader>
                <CardTitle>Companies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {companies?.map((company) => (
                    <div key={company.id} className="border rounded-lg p-4">
                      <h4 className="font-semibold">{company.name}</h4>
                      {company.industry && (
                        <Badge variant="outline" className="mt-2">
                          {company.industry}
                        </Badge>
                      )}
                      <p className="text-sm text-gray-500 mt-2">{company.location}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
