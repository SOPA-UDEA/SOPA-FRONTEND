import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Classroom } from "@/interface/Classroom";
import {
    getClassrooms,
    createClassroom,
    updateClassroom,
    deleteClassroom,
    changeClassroomStatus,
    isClassroomInUse,
} from "@/services/classroom";

// Fetch all classrooms
export function useClassrooms() {
    return useQuery<Classroom[], Error>({
        queryKey: ["classrooms"],
        queryFn: getClassrooms,
    });
}

// Create a new classroom
export function useCreateClassroom() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createClassroom,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["classrooms"] });
        },
    });
}

// Update an existing classroom
export function useUpdateClassroom() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ classroomId, classroom }: { classroomId: number; classroom: Partial<Classroom> }) =>
            updateClassroom(classroomId, classroom),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["classrooms"] });
        },
    });
}

// Delete a classroom
export function useDeleteClassroom() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (classroomId: number) => deleteClassroom(classroomId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["classrooms"] });
        },
    });
}

// Change status of a classroom
export function useChangeClassroomStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ classroomId, enabled }: { classroomId: number; enabled: boolean }) =>
            changeClassroomStatus(classroomId, enabled),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["classrooms"] });
        },
    });
}

//check if classroom is in use
export function useIsClassroomInUse(classroomId: number) {
    return useQuery({
        queryKey: ["classroom", classroomId, "in_use"],
        queryFn: () => isClassroomInUse(classroomId),
    });
}
