import { useMutation } from "@tanstack/react-query";
import { checkMirrorGroup, checkCapacity, checkCollisions, checkScheduleClassroomModified } from "@/services/dataAnalysis";
import { addToast } from "@heroui/react";
import { handleErrorMessage } from "./helpers/errorMessage"; 

export const useCheckCollisions = () => {

    const mutation = useMutation({
        mutationFn: checkCollisions,
        onSuccess: () => {
            addToast({
                title: "Análisis de colisiones completado",
                description: "El análisis de colisiones se ha realizado exitosamente.",
                color: "success",
            });
        },
        onError: (error: Error) => {

            const description = handleErrorMessage(error);

            addToast({
                title: "Error al realizar el análisis de colisiones",
                description,
                color: "danger",
            });
        },
    });

    return mutation;
}

export const useCheckScheduleClassroomModified = () => {

    const mutation = useMutation({
        mutationFn: checkScheduleClassroomModified,
        onSuccess: () => {
            addToast({
                title: "Análisis de horarios y aulas completado",
                description: "El análisis de horarios y aulas se ha realizado exitosamente.",
                color: "success",
            });
        },
        onError: (error: Error) => {

            const description = handleErrorMessage(error);


            addToast({
                title: "Error al realizar el análisis de horarios y aulas",
                description,
                color: "danger",
            });
        },
    });

    return mutation;
}

export const useCheckCapacity = () => {

    const mutation = useMutation({
        mutationFn: checkCapacity,
        onSuccess: () => {
            addToast({
                title: "Análisis de capacidad completado",
                description: "El análisis de capacidad se ha realizado exitosamente.",
                color: "success",
            });
        },
        onError: (error: Error) => {
            const description = handleErrorMessage(error);


            addToast({
                title: "Error al realizar el análisis de capacidad",
                description,
                color: "danger",
            });
        },
    });

    return mutation;
}

export const useCheckMirrorGroup = () => {

    const mutation = useMutation({
        mutationFn: checkMirrorGroup,
        onSuccess: () => {
            addToast({
                title: "Análisis de grupos espejo completado",
                description: "El análisis de grupos espejo se ha realizado exitosamente.",
                color: "success",
            });
        },
        onError: (error: Error) => {
            const description = handleErrorMessage(error);


            addToast({
                title: "Error al realizar el análisis de grupos espejo",
                description,
                color: "danger",
            });
        },
    });

    return mutation;
}