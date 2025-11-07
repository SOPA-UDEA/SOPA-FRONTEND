import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { uploadGroupClassroomDrai, updateGroupClassroomDrai, exportGroupClassroom } from '../services/groupClassroomService';
import { addToast } from "@heroui/react";
import { handleErrorMessage } from "./helpers/errorMessage";
import { fetchOwnedClassrooms, validateAssignClassroom, assignClassroom, OwnedClassroom, ValidationResult } from "../services/groupClassroomService";

export const useUploadExcel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: uploadGroupClassroomDrai,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groupClassroom"] });
      addToast({ title: "Archivo importado correctamente", description: "El archivo se ha importado exitosamente.", color: "success" });
    },
    onError: (error: any) => {
      const description = handleErrorMessage(error);
      addToast({ title: "Error al importar el archivo", description, color: "danger" });
    },
  });
};

export const useUpdateExcel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateGroupClassroomDrai,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groupClassroom"] });
      addToast({ title: "Archivo procesado correctamente", description: "El archivo se ha procesado exitosamente.", color: "success" });
    },
    onError: (error: any) => {
      const description = handleErrorMessage(error);
      addToast({ title: "Error al actualizar el archivo", description, color: "danger" });
    },
  });
};

export const useExportExcel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: exportGroupClassroom,
    onSuccess: ({ blob, filename }) => {
      queryClient.invalidateQueries({ queryKey: ["groupClassroom"] });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
      addToast({ title: "Archivo exportado correctamente", description: "El archivo se ha exportado exitosamente.", color: "success" });
    },
    onError: (error: any) => {
      const description = handleErrorMessage(error);
      addToast({ title: "Error al exportar", description, color: "danger" });
    },
  });
};

export const useOwnedClassrooms = () => {
  return useQuery<OwnedClassroom[]>({
    queryKey: ["groupClassroom", "ownedClassrooms"],
    queryFn: fetchOwnedClassrooms,
    staleTime: 60000,
  });
};

export const useValidateAssignClassroom = () => {
  return useMutation({
    mutationFn: async ({ groupId, classroomId }: { groupId: number; classroomId: number }) => {
      const res = await validateAssignClassroom(groupId, classroomId);
      return res as ValidationResult;
    },
    onError: (error: any) => {
      const description = handleErrorMessage(error);
      addToast({ title: "Error al validar aula", description, color: "danger" });
    },
  });
};

export const useAssignClassroom = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ groupId, classroomId }: { groupId: number; classroomId: number }) => {
      const res = await assignClassroom(groupId, classroomId);
      return res;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["groups"] });
      qc.invalidateQueries({ queryKey: ["groupClassroom"] });
      addToast({ title: "Aula asignada", description: "Se guardó la asignación correctamente.", color: "success" });
    },
    onError: (error: any) => {
      const status = error?.response?.status;
      if (status === 409) {
        const conflicts = error?.response?.data?.detail?.conflicts || [];
        const items = conflicts.map((c: any) => `Grupo ${c.groupId} en ${c.schedule}`).join(" | ");
        addToast({ title: "Conflicto de horario", description: items || "El aula está ocupada en alguno de los horarios.", color: "warning" });
        return;
      }
      const description = handleErrorMessage(error);
      addToast({ title: "Error al asignar aula", description, color: "danger" });
    },
  });
};
