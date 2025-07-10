import api from "../db/config";
import { AcademicProgram } from "../interface/AcademicProgram";

export const getAcademicProgram = async (): Promise<AcademicProgram[]> => {
  const response = await api.get("/academic_program/lists");
  return response.data;
};
