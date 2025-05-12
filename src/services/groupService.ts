import api from "../db/config";
import { Academic, Group, Mirror } from "../interface/Group";

export const getGroups = async (): Promise<Group[]> => {
  const response = await api.get("/group/lists");
  return response.data;
};

export const createGroup = async (group: Group, academic: Academic, mirror: Mirror): Promise<Group> => {
  const response = await api.post("/group/create", {group, academic, mirror});
  return response.data;
}
 