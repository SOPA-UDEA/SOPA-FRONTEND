import api from "../db/config";
import { Academic, GetGroupsParams, Group,  GroupRequestUpdate, GroupResponse, Mirror, PaginatedGroupResponse, ScheduleConflict } from "../interface/Group";


export const createGroup = async (group: Group, academic: Academic, mirror: Mirror) => {
  	const response = await api.post("/group/create", {group, academic, mirror});
  	return response.data;
}

export const getGroupByAcdemicScheduleId = async (academicScheduleId: number, ): Promise<GroupResponse[]> => {
  	const response = await api.post(`/group/schedule/${academicScheduleId}/list`, );
  	return response.data;
}

export const deleteGroupById = async (groupId: number): Promise<void> => {
  	await api.delete(`/group/delete/${groupId}`);
}

export const updateGroupById = async (group: GroupRequestUpdate, groupId: number) => {
	const response = await api.put(`/group/update/${groupId}`, group);
	return response.data;
};

export const createBaseGroups = async (pensums: number[], scheduleId: number) => {
	const response = await api.post(`/group/create/baseGroup/${scheduleId}`, pensums);
	return response.data
}


export const getBySchedulePensum = async (
  	{ academicScheduleId, pensumIds, skip = 0, take = 15 }: GetGroupsParams
): Promise<PaginatedGroupResponse> => {

	const params = new URLSearchParams();

	pensumIds.forEach(id => params.append("pensumIds", id.toString()));
	params.append("skip", skip.toString());
	params.append("take", take.toString());

	const response = await api.get(`/group/schedule/${academicScheduleId}/list?${params.toString()}`);
	return response.data;
};

export const createGroupOf = async (group_id: number) => {
	const response = await api.post(`/group/create-of/${group_id}`);
	return response.data;
}

export const updateGroupSchedule = async(group_id: number, schedules: string[]) => {
	const response = await api.put(`/group/update/schedule/${group_id}`, schedules);
	return response.data;
}

export const markMirrorGroups = async(group_ids: number[]) => {
	const response = await api.put("/group/mark-as-mirror", group_ids);
	return response.data;
}

export const getRelatedGroupsSchedule = async (groupId: number, pensumIds: number[], scheduleId: number): Promise<GroupResponse[]> => {
	const params = new URLSearchParams();

	pensumIds.forEach(id => params.append("pensumIds", id.toString()));
	params.append("groupId", groupId.toString());

	const response = await api.get(`/group/${scheduleId}/subjects-schedules/?${params.toString()}`);
	return response.data;
};

export const getRelatedGroupsLevel = async (groupId: number, pensumIds: number[], scheduleId: number): Promise<GroupResponse[]> => {
	const params = new URLSearchParams();

	pensumIds.forEach(id => params.append("pensumIds", id.toString()));
	params.append("groupId", groupId.toString());

	const response = await api.get(`/group/${scheduleId}/level-schedules/?${params.toString()}`);
	return response.data;
};

export const getScheduleConflicts = async (pensumIds: number[], scheduleId: number): Promise<ScheduleConflict[]> => {
	const params = new URLSearchParams();

	pensumIds.forEach(id => params.append("pensumIds", id.toString()));

	const response = await api.get(`/group/schedule/${scheduleId}/conflict-detection?${params.toString()}`);
	return response.data;
};

export const getGroupsToEsxport = async (scheduleId: number, pensumId: number): Promise<GroupResponse[]> => {
	const response = await api.get(`/group/schedule/${scheduleId}/pensum/${pensumId}/`);
	return response.data;
};

export const markMirrorGroupsAny = async(group_ids: number[]) => {
	const response = await api.put("/group/mark-as-mirror-any", group_ids);
	return response.data;
}