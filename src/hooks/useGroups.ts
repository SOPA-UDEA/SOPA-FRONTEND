import { GroupRequestUpdate } from "@/interface/Group";
import { deleteGroupById, updateGroupById } from "@/services/groupService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

 type UpdateGroupPayload = {
  groupId: number;
  group: GroupRequestUpdate;
};

   export function usedeleteGroupById() {
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

