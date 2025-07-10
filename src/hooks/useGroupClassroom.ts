import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadGroupClassroomDrai, updateGroupClassroomDrai, exportGroupClassroom } from '../services/groupClassroomService';
import { addToast } from "@heroui/react";
import { handleErrorMessage } from "./helpers/errorMessage";
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
        onError: (error: Error) => {

            const description = handleErrorMessage(error);

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
        onError: (error: Error) => {
            const description = handleErrorMessage(error);


            addToast({
                title: "Error al actualizar el archivo",
                description,
                color: "danger",
            });
        },
    });
    return mutation;
}

export const useExportExcel = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: exportGroupClassroom,
        onSuccess: ({ blob, filename }) => {
            queryClient.invalidateQueries({ queryKey: ["groupClassroom"] });

            // Crea un enlace de descarga
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(url);
            addToast({
                title: "Archivo exportado correctamente",
                description: "El archivo se ha exportado exitosamente.",
                color: "success",
            });
        },
        onError: (error: Error) => {
            const description = handleErrorMessage(error);

            addToast({
                title: "Error al exportar",
                description,
                color: "danger",
            });
        },
    });

    return mutation;
};
