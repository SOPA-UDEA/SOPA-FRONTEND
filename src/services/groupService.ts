import api from "../db/config";
import { Academic, Group, GroupResponse, Mirror } from "../interface/Group";

export const getGroups = async (): Promise<Group[]> => {
  const response = await api.get("/group/lists");
  return response.data;
};

export const createGroup = async (group: Group, academic: Academic, mirror: Mirror) => {
  const response = await api.post("/group/create", {group, academic, mirror});
  return response.data;
}

export const getGroupByAcdemicScheduleId = async (academicScheduleId: number): Promise<GroupResponse[]> => {
  const response = await api.get(`/group/academic_schedule/${academicScheduleId}/groups`);
  return response.data;
}