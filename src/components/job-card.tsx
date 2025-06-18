
import { Job } from '@/types/job';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Building, DollarSign } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

interface JobCardProps {
  job: Job;
  compact?: boolean;
}

export function JobCard({ job, compact = false }: JobCardProps) {
  const formatJobType = (type: string) => {
    return type.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatSalary = (salary?: string) => {
    if (!salary) return null;
    return salary;
  };

  const truncateDescription = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-300 group">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2">
              {job.title}
            </h3>
            <div className="flex items-center text-gray-600 mb-2">
              <Building className="h-4 w-4 mr-1 flex-shrink-0" />
              <span className="font-medium">{job.company}</span>
            </div>
            <div className="flex items-center text-gray-500 mb-3">
              <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
              <span className="text-sm">{job.location}</span>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <Badge variant="secondary" className="whitespace-nowrap">
              {formatJobType(job.type)}
            </Badge>
            {formatSalary(job.salary) && (
              <div className="flex items-center text-green-600 text-sm font-medium">
                <DollarSign className="h-4 w-4 mr-1" />
                {formatSalary(job.salary)}
              </div>
            )}
          </div>
        </div>

        {!compact && (
          <div className="mb-4">
            <p className="text-gray-600 text-sm leading-relaxed">
              {truncateDescription(job.description)}
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" className="text-xs">
            {job.category}
          </Badge>
          {job.requirements.slice(0, 3).map((req, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {req}
            </Badge>
          ))}
          {job.requirements.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{job.requirements.length - 3} more
            </Badge>
          )}
        </div>

        <div className="flex items-center text-gray-400 text-xs mb-4">
          <Calendar className="h-3 w-3 mr-1" />
          <span>Posted {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}</span>
        </div>
      </CardContent>

      <CardFooter className="px-6 pb-6 pt-0">
        <div className="flex w-full space-x-2">
          <Button asChild variant="outline" className="flex-1">
            <Link to={`/jobs/${job.id}`}>
              View Details
            </Link>
          </Button>
          {job.application_url && (
            <Button asChild className="flex-1">
              <a href={job.application_url} target="_blank" rel="noopener noreferrer">
                Apply Now
              </a>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
