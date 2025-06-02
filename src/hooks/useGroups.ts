import { GroupRequestUpdate } from "@/interface/Group";
import { createBaseGroups, deleteGroupById, getBySchedulePensum, updateGroupById } from "@/services/groupService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

 type UpdateGroupPayload = {
	groupId: number;
	group: GroupRequestUpdate;
};

type BaseGroupsPayload = {
	scheduleId: number;
	pensumIds: number[];
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

export function useGroupsBySchedulePensum() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ scheduleId, pensumIds }:BaseGroupsPayload ) => {
		return await getBySchedulePensum(pensumIds, scheduleId);
		},
		onSuccess: () => {
		queryClient.invalidateQueries({ queryKey: ["groups"] });
		},
	});
}


