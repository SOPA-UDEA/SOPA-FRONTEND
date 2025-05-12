// hooks/useSubjectsByPensumIds.ts
import { useQueries } from '@tanstack/react-query';
import { getSubjectByPensum } from '@/services/subjectService';
import { Subject } from '@/interface/Subject';

export const useSubjectsByPensumIds = (pensumIds: number[]) => {
  const queries = useQueries({
    queries: pensumIds.map((id) => ({
      queryKey: ['subjects', id],
      queryFn: () => getSubjectByPensum(id),
      enabled: !!id,
    })),
  });

  const isLoading = queries.some(q => q.isLoading);
  const isError = queries.some(q => q.isError);
  const errors = queries.filter(q => q.isError).map(q => q.error);

  const subjects: Subject[] = queries
    .filter(q => q.isSuccess)
    .flatMap(q => q.data ?? []);

  return {
    subjects,
    isLoading,
    isError,
    errors,
  };
};