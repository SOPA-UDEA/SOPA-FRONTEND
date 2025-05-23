import { getGroupByAcdemicScheduleId } from "@/services/groupService"
import { useQuery } from "@tanstack/react-query"

export const useGroupsByScheduleId = ( academicScheduleId: number  ) => {
    const {
        data: groups = [],
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["groups", academicScheduleId],
        queryFn: () => getGroupByAcdemicScheduleId(academicScheduleId as number),
        enabled: !!academicScheduleId,
      });

    return {
        groups,
        isLoading,
        isError,
        error,
    };
      
}

