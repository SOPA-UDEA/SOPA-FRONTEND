import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadGroupClassroomDrai } from "../services/groupClassroomService";

export const useUploadExcel = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: uploadGroupClassroomDrai,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["groupClassroom"] });
        },
        onError: (error) => {
            console.error("Error uploading group classroom:", error);
        },
    });

    return mutation;
};

