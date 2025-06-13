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
}

export const exportGroupClassroom = async (
  data: ExportGroupClassroom
): Promise<{ blob: Blob; filename: string }> => {
  const response = await api.post("/group_classroom/export-excel", data, {
    responseType: "blob",
  });

  // Extraer el nombre del archivo del header
  const contentDisposition = response.headers["content-disposition"];
  let filename = "programacion_academica.xlsx"; // por defecto

  const match = contentDisposition?.match(/filename="?([^"]+)"?/);
  if (match && match[1]) {
    filename = decodeURIComponent(match[1]);
  }

  return { blob: response.data, filename };
};
