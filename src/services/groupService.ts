import api from "../db/config";
import { Group } from "../interface/Group";

export const getGroups = async (): Promise<Group[]> => {
  const response = await api.get("/group/lists");
  return response.data;
};

export const createGroup = async (group: Group): Promise<Group> => {
  const response = await api.post("/group/create", group);
  return response.data;
}
 