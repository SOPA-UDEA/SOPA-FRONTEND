import { Group } from "@/interface/Group";
import { createGroup } from "@/services/groupService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (group:Group) => createGroup(group),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group"] });
    },

    onError: (error) => {
      console.error("Error creando grupo:", error);
    },
  });
};