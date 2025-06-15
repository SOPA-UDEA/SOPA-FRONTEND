import { GroupRequestUpdate } from "@/interface/Group";
import { createBaseGroups, createGroupOf, deleteGroupById, getBySchedulePensum, markMirrorGroups, updateGroupById, updateGroupSchedule } from "@/services/groupService";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

 type UpdateGroupPayload = {
	groupId: number;
	group: GroupRequestUpdate;
};

type BaseGroupsPayload = {
	scheduleId: number;
	pensumIds: number[];
}

interface UseGroupsPaginatedPayload {
  academicScheduleId: number | undefined;
  pensumIds: number[];
  skip?: number;
  take?: number;
}

interface UpdateSchedule {
	group_id: number;
	schedules: string[];
}

export function useDeleteGroupById() {
	const queryClient = useQueryClient();

		return useMutation({
			mutationFn: (groupId: number) => deleteGroupById(groupId),
			onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["groups"] });
			},
		});
    }

export function useUpdateGroupById() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ groupId, group }: UpdateGroupPayload) => {
		return await updateGroupById(group, groupId);
		},
		onSuccess: () => {
		queryClient.invalidateQueries({ queryKey: ["groups"] });
		},
	});
}

export function useCreateBaseGroup() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ scheduleId, pensumIds }:BaseGroupsPayload ) => {
		return await createBaseGroups(pensumIds, scheduleId);
		},
		onSuccess: () => {
		queryClient.invalidateQueries({ queryKey: ["groups"] });
		},
	});
}

export function useCreateGroupOf(){
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (groupId: number) => {
		return await createGroupOf(groupId);
		},

		onSuccess: () => {
		queryClient.invalidateQueries({ queryKey: ["groups"] });
		},
	});
}

export function useGroupsBySchedulePaginated({
	academicScheduleId,
	pensumIds,
	skip = 0,
	take = 15,
}: UseGroupsPaginatedPayload) {
	return useQuery({
		queryKey: ["groups", academicScheduleId, pensumIds, skip, take],
		queryFn: () =>
		getBySchedulePensum({
			academicScheduleId: academicScheduleId as number,
			pensumIds,
			skip,
			take,
		}),
		enabled: typeof academicScheduleId === "number" && pensumIds.length > 0,
	});
}

export function useUpdateGroupSchedules(){
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({group_id, schedules}: UpdateSchedule) => {
		return await updateGroupSchedule(group_id, schedules);
		},

		onSuccess: () => {
		queryClient.invalidateQueries({ queryKey: ["groups"] });
		},
	});
}

export function useMarkMirrorGroups(){
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (group_ids: number[]) => {
		return await markMirrorGroups(group_ids);
		},

		onSuccess: () => {
		queryClient.invalidateQueries({ queryKey: ["groups"] });
		},
	});
}