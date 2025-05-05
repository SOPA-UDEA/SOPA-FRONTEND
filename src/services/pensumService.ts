// services/pensumService.ts
import api from "./index";
import { Pensum } from "../interface/Pensum";

export const getPensums = async (): Promise<Pensum[]> => {
  const response = await api.get("http://127.0.0.1:8000/pensum/lists");
  return response.data.pensums;
};