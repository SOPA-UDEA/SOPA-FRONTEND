import { useQuery } from "@tanstack/react-query";
import { getAcademicProgram } from "../services/academicProgramService";

export const useAcademicProgram = () => {
  const {
    data: academicPrograms= [],
    isLoading,
    isError,
    error,
 } = useQuery({
    queryKey: ["academicPrograms"],
    queryFn: getAcademicProgram,
  });

  return {
    academicPrograms,
    isLoading,
    isError,
    error,
  };
};