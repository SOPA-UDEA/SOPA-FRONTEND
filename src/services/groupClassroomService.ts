import api from "../db/config";
import { GroupClassroomDrai, ExportGroupClassroom } from "../interface/GroupClassroom";

export const uploadGroupClassroomDrai = async (data: GroupClassroomDrai): Promise<string> => {
  const formData = new FormData();
  formData.append("semester", data.semester);
  formData.append("pensumId", data.pensumId.toString());
  formData.append("file", data.file);
  const response = await api.post<string>("/group_classroom/upload-excel-drai", formData);
  return response.data;
};

export const updateGroupClassroomDrai = async (data: GroupClassroomDrai): Promise<string> => {
  const formData = new FormData();
  formData.append("semester", data.semester);
  formData.append("pensumId", data.pensumId.toString());
  formData.append("file", data.file);
  const response = await api.post<string>("/group_classroom/update-excel-drai", formData);
  return response.data;
};

export const exportGroupClassroom = async (
  data: ExportGroupClassroom
): Promise<{ blob: Blob; filename: string }> => {
  try {
    const response = await api.post("/group_classroom/export-excel", data, { responseType: "blob" });
    const contentType = response.headers["content-type"];
    if (contentType && contentType.includes("application/json")) {
      const text = await response.data.text();
      const json = JSON.parse(text);
      throw new Error(json.error || "Ocurrió un error inesperado al exportar.");
    }
    const contentDisposition = response.headers["content-disposition"];
    let filename = "programacion_academica.xlsx";
    const match = contentDisposition?.match(/filename="?([^"]+)"?/);
    if (match && match[1]) filename = decodeURIComponent(match[1]);
    return { blob: response.data, filename };
  } catch (error: any) {
    throw new Error(error.message || "Error al exportar el archivo.");
  }
};

export type OwnedClassroom = { id: number; location: string; capacity: number | null };
export type ValidationResult = { conflicts: { groupId: number; schedule: string }[] };

export const fetchOwnedClassrooms = async (): Promise<OwnedClassroom[]> => {
  const res = await api.get("/group_classroom/owned-classrooms");
  return res.data;
};

export const validateAssignClassroom = async (groupId: number, classroomId: number): Promise<ValidationResult> => {
  const res = await api.post("/group_classroom/assign-classroom/validate", { groupId, classroomId });
  return res.data;
};

export const assignClassroom = async (groupId: number, classroomId: number): Promise<{ message: string }> => {
  const res = await api.put("/group_classroom/assign-classroom", { groupId, classroomId });
  return res.data;
};
