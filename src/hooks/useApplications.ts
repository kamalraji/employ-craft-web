import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { JobApplication, CreateApplicationData } from '@/types/application';
import { useEffect } from 'react';

export function useApplications(search?: string) {
  const queryClient = useQueryClient();
  const queryResult = useQuery({
    queryKey: ['applications', search],
    queryFn: async (): Promise<JobApplication[]> => {
      let query = supabase
        .from('job_applications')
        .select('*')
        .order('created_at', { ascending: false });
      if (search) {
        query = query.or(
          `applicant_name.fts.${search},applicant_email.fts.${search},cover_letter.fts.${search}`
        );
      }
      const { data, error } = await query;
      if (error) {
        throw new Error(error.message);
      }
      return data || [];
    },
  });
  useEffect(() => {
    const channel = supabase.channel('realtime-job_applications')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'job_applications' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['applications'] });
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
  return queryResult;
}

export function useCreateApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (applicationData: CreateApplicationData) => {
      const { data, error } = await supabase
        .from('job_applications')
        .insert([applicationData])
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
}
