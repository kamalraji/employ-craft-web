
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCompanies } from '@/hooks/useCompanies';
import { Building, Globe, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CompaniesPage() {
  const { data: companies, isLoading } = useCompanies();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Companies</h1>
          <p className="text-xl text-gray-600">Discover amazing companies looking for talent</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-64 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies?.map((company) => (
              <Card key={company.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-600 p-3 rounded-lg">
                      <Building className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{company.name}</CardTitle>
                      {company.industry && (
                        <Badge variant="outline" className="mt-1">
                          {company.industry}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {company.description && (
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {company.description}
                    </p>
                  )}
                  
                  <div className="space-y-2 mb-4">
                    {company.location && (
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-2" />
                        {company.location}
                      </div>
                    )}
                    {company.size && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="h-4 w-4 mr-2" />
                        {company.size} employees
                      </div>
                    )}
                    {company.website && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Globe className="h-4 w-4 mr-2" />
                        <a 
                          href={company.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-blue-600"
                        >
                          Visit Website
                        </a>
                      </div>
                    )}
                  </div>

                  <Button asChild className="w-full">
                    <Link to={`/jobs?company=${encodeURIComponent(company.name)}`}>
                      View Jobs
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
