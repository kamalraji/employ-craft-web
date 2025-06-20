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
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUpdateJob, useCreateJob } from '@/hooks/useJobs';

export default function AdminDashboard() {
  const { data: jobsData } = useJobs({}, 1);
  const { data: applications } = useApplications();
  const { data: companies } = useCompanies();
  const [editJob, setEditJob] = useState(null);
  const [editForm, setEditForm] = useState({});
  const updateJob = useUpdateJob();
  const [createJobOpen, setCreateJobOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: '',
    company: '',
    location: '',
    status: 'ACTIVE',
    description: '',
    type: 'FULL_TIME',
    category: '',
    salary: '',
    requirements: [],
    application_url: '',
  });
  const createJob = useCreateJob();

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

  const handleEditClick = (job) => {
    setEditJob(job);
    setEditForm({ ...job });
  };

  const handleEditChange = (key, value) => {
    setEditForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleEditSave = async () => {
    await updateJob.mutateAsync(editForm);
    setEditJob(null);
  };

  const handleCreateChange = (key, value) => {
    setCreateForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleCreateSave = async () => {
    await createJob.mutateAsync(createForm);
    setCreateJobOpen(false);
    setCreateForm({
      title: '', company: '', location: '', status: 'ACTIVE', description: '', type: 'FULL_TIME', category: '', salary: '', requirements: [], application_url: '',
    });
  };

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
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Job Management</CardTitle>
                <Button onClick={() => setCreateJobOpen(true)}>Create Job</Button>
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
                          <Button size="sm" className="mt-2" onClick={() => handleEditClick(job)}>
                            Edit
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            {/* Edit Job Modal */}
            <Dialog open={!!editJob} onOpenChange={() => setEditJob(null)}>
              <DialogContent>
                <h3 className="text-lg font-semibold mb-4">Edit Job</h3>
                <div className="space-y-3">
                  <Label>Title</Label>
                  <Input value={editForm.title || ''} onChange={e => handleEditChange('title', e.target.value)} />
                  <Label>Company</Label>
                  <Input value={editForm.company || ''} onChange={e => handleEditChange('company', e.target.value)} />
                  <Label>Location</Label>
                  <Input value={editForm.location || ''} onChange={e => handleEditChange('location', e.target.value)} />
                  <Label>Status</Label>
                  <Select value={editForm.status || ''} onValueChange={v => handleEditChange('status', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="ARCHIVED">Archived</SelectItem>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                  <Label>Description</Label>
                  <Input value={editForm.description || ''} onChange={e => handleEditChange('description', e.target.value)} />
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setEditJob(null)}>Cancel</Button>
                  <Button onClick={handleEditSave}>Save</Button>
                </div>
              </DialogContent>
            </Dialog>
            {/* Create Job Modal */}
            <Dialog open={createJobOpen} onOpenChange={setCreateJobOpen}>
              <DialogContent>
                <h3 className="text-lg font-semibold mb-4">Create Job</h3>
                <div className="space-y-3">
                  <Label>Title</Label>
                  <Input value={createForm.title} onChange={e => handleCreateChange('title', e.target.value)} />
                  <Label>Company</Label>
                  <Input value={createForm.company} onChange={e => handleCreateChange('company', e.target.value)} />
                  <Label>Location</Label>
                  <Input value={createForm.location} onChange={e => handleCreateChange('location', e.target.value)} />
                  <Label>Status</Label>
                  <Select value={createForm.status} onValueChange={v => handleCreateChange('status', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="ARCHIVED">Archived</SelectItem>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                  <Label>Type</Label>
                  <Select value={createForm.type} onValueChange={v => handleCreateChange('type', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FULL_TIME">Full Time</SelectItem>
                      <SelectItem value="PART_TIME">Part Time</SelectItem>
                      <SelectItem value="CONTRACT">Contract</SelectItem>
                      <SelectItem value="INTERNSHIP">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                  <Label>Category</Label>
                  <Input value={createForm.category} onChange={e => handleCreateChange('category', e.target.value)} />
                  <Label>Salary</Label>
                  <Input value={createForm.salary} onChange={e => handleCreateChange('salary', e.target.value)} />
                  <Label>Description</Label>
                  <Input value={createForm.description} onChange={e => handleCreateChange('description', e.target.value)} />
                  <Label>Application URL</Label>
                  <Input value={createForm.application_url} onChange={e => handleCreateChange('application_url', e.target.value)} />
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setCreateJobOpen(false)}>Cancel</Button>
                  <Button onClick={handleCreateSave}>Create</Button>
                </div>
              </DialogContent>
            </Dialog>
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
