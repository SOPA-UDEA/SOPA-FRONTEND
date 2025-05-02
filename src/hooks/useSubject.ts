import { useQuery } from "@tanstack/react-query";
import { getSubjectByPensum } from "../services/subjectService";

export const useSubject = (id: number) => {
  const {
    data: subjects = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["subjects", id],
    queryFn: ({ queryKey }) => {
        const [, id] = queryKey; 
        return getSubjectByPensum(id as number); 
      },
  });

  return {
    subjects,
    isLoading,
    isError,
    error,
  };
};