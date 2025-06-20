import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Company } from '@/types/company';
import { useEffect } from 'react';

export function useCompanies(search?: string) {
  const queryClient = useQueryClient();
  const queryResult = useQuery({
    queryKey: ['companies', search],
    queryFn: async (): Promise<Company[]> => {
      let query = supabase
        .from('companies')
        .select('*')
        .order('name');
      if (search) {
        query = query.or(
          `name.fts.${search},description.fts.${search},industry.fts.${search},location.fts.${search}`
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
    const channel = supabase.channel('realtime-companies')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'companies' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['companies'] });
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
  return queryResult;
}

export function useCompany(id: string) {
  return useQuery({
    queryKey: ['company', id],
    queryFn: async (): Promise<Company> => {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    enabled: !!id,
  });
}
