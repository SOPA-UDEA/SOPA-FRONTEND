import { AcademicScheduleRequest } from "@/interface/AcademicSchedule";
import { createAcademicSchedule, getAcademicScheduleBySemester } from "@/services/academicScheduleService";
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

export const useGetAcademicScheduleBySemester = () => {
    return useMutation({
        mutationFn: (semester: string) => getAcademicScheduleBySemester(semester),
        onError: (error) => {
            console.error("Error fetching academic schedule by semester:", error);
        },
    });
};