import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAcademicSchedule } from "@/services/academicScheduleService";
import { AcademicSchedule } from "@/interface/AcademicSchedule";

export const useCreateAcademicSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (schedule: AcademicSchedule) => createAcademicSchedule(schedule),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academicSchedules"] });
    },

    onError: (error) => {
      console.error("Error creando programación académica:", error);
    },
  });
};