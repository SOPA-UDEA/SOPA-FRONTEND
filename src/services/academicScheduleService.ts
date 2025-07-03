import api from "../db/config";
import { AcademicSchedule, AcademicScheduleRequest, AcademicScheduleResponse } from "../interface/AcademicSchedule";

export const getAcademicSchedule = async (): Promise<AcademicSchedule[]> => {
  const response = await api.get("/academic_schedule/lists");
  return response.data;
};

export const createAcademicSchedule = async (academicSchedule: AcademicScheduleRequest): Promise<AcademicScheduleResponse> => {
  const response = await api.post("/academic_schedule/create", academicSchedule);
  return response.data;
};

export const getAcademicScheduleBySemester = async (semester: string): Promise<AcademicScheduleResponse> => {
  const response = await api.get(`/academic_schedule/semester/${semester}`);
  return response.data;
}

export const getSchedulesToExport = async (pensumId: number): Promise<AcademicScheduleResponse[]> => {
  const response = await api.get(`/academic_schedule/all/by-pensum/${pensumId}`);
  return response.data;
}

