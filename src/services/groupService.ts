import api from "../db/config";
import { Academic, Group,  GroupRequestUpdate, GroupResponse, Mirror } from "../interface/Group";

export const createGroup = async (group: Group, academic: Academic, mirror: Mirror) => {
  const response = await api.post("/group/create", {group, academic, mirror});
  return response.data;
}

export const getGroupByAcdemicScheduleId = async (academicScheduleId: number): Promise<GroupResponse[]> => {
  const response = await api.get(`/group/academic_schedule/${academicScheduleId}/groups`);
  return response.data;
}

export const deleteGroupById = async (groupId: number): Promise<void> => {
  await api.delete(`/group/delete/${groupId}`);
}

export const updateGroupById = async (group: GroupRequestUpdate, groupId: number) => {
  const response = await api.put(`/group/update/${groupId}`, group);
  return response.data;
};
