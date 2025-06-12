import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadGroupClassroomDrai, updateGroupClassroomDrai } from "../services/groupClassroomService";
import { addToast } from "@heroui/react";

export const useUploadExcel = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: uploadGroupClassroomDrai,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["groupClassroom"] });
            addToast({
                title: "Archivo importado correctamente",
                description: "El archivo se ha importado exitosamente.",
                color: "success",
            });
        },
        onError: (error: any) => {
            let description = error.message;

            if (error.isAxiosError) {
                const axiosError = error as any;
                if (axiosError.response?.data?.detail) {
                    description = axiosError.response.data.detail;
                }
            }

            addToast({
                title: "Error al importar el archivo",
                description,
                color: "danger",
            });
        },
    });

    return mutation;
};

export const useUpdateExcel = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: updateGroupClassroomDrai,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["groupClassroom"] });
            addToast({
                title: "Archivo procesado correctamente",
                description: "El archivo se ha procesado exitosamente.",
                color: "success",
            });
        },
        onError: (error: any) => {
            let description = error.message;

            if (error.isAxiosError) {
                const axiosError = error as any;
                if (axiosError.response?.data?.detail) {
                    description = axiosError.response.data.detail;
                }
            }

            addToast({
                title: "Error al actualizar el archivo",
                description,
                color: "danger",
            });
        },
    });
    return mutation;
}
