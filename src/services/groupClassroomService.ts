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
  try {
    const response = await api.post("/group_classroom/export-excel", data, {
      responseType: "blob",
    });

    // Verify if the response is an error
    const contentType = response.headers["content-type"];
    if (contentType && contentType.includes("application/json")) {
      const text = await response.data.text();
      const json = JSON.parse(text);
      throw new Error(json.error || "Ocurrió un error inesperado al exportar.");
    }

    // Get the filename from the Content-Disposition header
    const contentDisposition = response.headers["content-disposition"];
    let filename = "programacion_academica.xlsx"; // name default

    const match = contentDisposition?.match(/filename="?([^"]+)"?/);
    if (match && match[1]) {
      filename = decodeURIComponent(match[1]);
    }

    return { blob: response.data, filename };
  } catch (error: any) {
    // Aquí puedes propagar el error personalizado
    throw new Error(error.message || "Error al exportar el archivo.");
  }
};
