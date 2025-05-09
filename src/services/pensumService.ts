// services/pensumService.ts
import api from "../db/config";
import { Pensum } from "../interface/Pensum";

export const getPensums = async (): Promise<Pensum[]> => {
  const response = await api.get("/pensum/lists");
  return response.data;
};