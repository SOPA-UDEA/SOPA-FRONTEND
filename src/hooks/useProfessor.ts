import { ProfessorResponse } from "@/interface/Group";
import { getProfessors } from "@/services/professorService";
import { useQuery } from "@tanstack/react-query";


// Fetch all professors
export function useProfessors() {
    return useQuery<ProfessorResponse[], Error>({
        queryKey: ["classrooms"],
        queryFn: getProfessors,
    });
}