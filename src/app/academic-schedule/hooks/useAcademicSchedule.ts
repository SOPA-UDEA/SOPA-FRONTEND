import { getAcademicSchedule } from "@/services/academicScheduleService";
import { useQuery } from "@tanstack/react-query";


export const useAcademicSchedule = () => {
  const {
    data: academicPrograms= [],
    isLoading,
    isError,
    error,
 } = useQuery({
    queryKey: ["academicPrograms"],
    queryFn: getAcademicSchedule,
  });

  return {
    academicPrograms,
    isLoading,
    isError,
    error,
  };
};