import api from "./index";
import { AcademicProgram } from "../interface/AcademicProgram";

export const getAcademicProgram = async (): Promise<AcademicProgram[]> => {
  const response = await api.get("http://127.0.0.1:8000/academic_program/lists");
  return response.data.academic_program;
};