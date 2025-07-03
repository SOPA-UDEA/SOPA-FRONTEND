// services/pensumService.ts
import api from "../db/config";
import { Pensum } from "../interface/Pensum";

export const getPensums = async (): Promise<Pensum[]> => {
  const response = await api.get("/pensum/lists");
  return response.data;
};

export const getPensumsById = async (pensumId: number): Promise<Pensum> => {
  const response = await api.get(`/pensum/id/${pensumId}`);
  return response.data;
};