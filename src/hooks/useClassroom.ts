import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Classroom } from "@/interface/Classroom";
import {
    getClassrooms,
    createClassroom,
    uploadClassrooms,
    updateClassroom,
    deleteClassroom,
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

// Upload classrooms from Excel file
export function useUploadClassrooms() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: uploadClassrooms,
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
