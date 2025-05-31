import { ProfessorResponse } from "@/interface/Group";
import api from "../db/config";

export const getProfessors = async (): Promise<ProfessorResponse[]> => {
  const response = await api.get("/professor/lists");
  return response.data;
};