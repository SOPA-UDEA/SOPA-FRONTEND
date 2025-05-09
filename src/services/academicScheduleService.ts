import api from "../db/config";
import { AcademicSchedule, AcademicScheduleResponse } from "../interface/AcademicSchedule";

export const getAcademicSchedule = async (): Promise<AcademicSchedule[]> => {
  const response = await api.get("/academic_schedule/lists");
  return response.data;
};

export const createAcademicSchedule = async (academicSchedule: AcademicSchedule): Promise<AcademicScheduleResponse> => {
  const response = await api.post("/academic_schedule/create", academicSchedule);
  return response.data;
};
