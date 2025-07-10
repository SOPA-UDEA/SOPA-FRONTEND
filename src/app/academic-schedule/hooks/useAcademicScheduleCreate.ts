import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAcademicSchedule } from "@/services/academicScheduleService";
import { AcademicScheduleRequest } from "@/interface/AcademicSchedule";

export const useCreateAcademicSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (schedule: AcademicScheduleRequest) =>
      createAcademicSchedule(schedule),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academicSchedules"] });
    },

    onError: (error) => {
      console.error("Error creando programación académica:", error);
    },
  });
};
