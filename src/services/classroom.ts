import { Classroom } from "@/interface/Classroom";
import api from "../db/config";

// Get all classrooms
export async function getClassrooms(): Promise<Classroom[]> {
  const response = await api.get<Classroom[]>("/classroom/list");
  return response.data;
}

// Create a new classroom
export async function createClassroom(
  classroom: Omit<Classroom, "id">
): Promise<Classroom> {
  const response = await api.post<Classroom>("/classroom/create", classroom);
  return response.data;
}

// Upload classrooms from Excel file
export async function uploadClassrooms(
  file: File
): Promise<{ message: string }> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api.post<{ message: string }>(
    "/classroom/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
}

// Update an existing classroom
export async function updateClassroom(
  classroomId: number,
  classroom: Partial<Classroom>
): Promise<Classroom> {
  const response = await api.put<Classroom>(
    `/classroom/update/${classroomId}`,
    classroom
  );
  return response.data;
}

// Delete a classroom
export async function deleteClassroom(classroomId: number): Promise<void> {
  await api.delete(`/classroom/delete/${classroomId}`);
}
