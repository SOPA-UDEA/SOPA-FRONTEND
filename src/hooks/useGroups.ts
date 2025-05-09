import { getGroupByAcdemicSchedulePenusm } from "@/services/groupService"
import { useQuery } from "@tanstack/react-query"

export const useGroups = ( academicScheduleId: number  ) => {
    const {
        data: groups = [],
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["groups", academicScheduleId],
        queryFn: ({ queryKey }) => {
            const [, id] = queryKey; 
            return getGroupByAcdemicSchedulePenusm(academicScheduleId as number); 
          },
      });

    return {
        groups,
        isLoading,
        isError,
        error,
    };
      
}

