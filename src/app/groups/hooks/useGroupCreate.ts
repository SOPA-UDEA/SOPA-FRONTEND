import { AcademicSchedule } from "@/interface/AcademicSchedule";
import { Group, GroupRequest } from "@/interface/Group";
import { createGroup } from "@/services/groupService";
import { useMutation, useQueryClient } from "@tanstack/react-query";




export const useCreateGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ group, academic, mirror }: GroupRequest) =>
      createGroup(group, academic, mirror),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group"] });
    },

    onError: (error) => {
      console.error("Error creando grupo:", error);
    },
  });
};