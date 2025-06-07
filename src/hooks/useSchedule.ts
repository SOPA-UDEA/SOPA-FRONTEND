import { AcademicScheduleRequest } from "@/interface/AcademicSchedule";
import { createAcademicSchedule } from "@/services/academicScheduleService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

//create academicSchedule with pensums
export default function useCreateAcademicSchedule() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (schedule: AcademicScheduleRequest) => createAcademicSchedule(schedule),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["academicSchedules"] });
        },
    });
};