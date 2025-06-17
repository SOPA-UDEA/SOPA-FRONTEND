import { useQuery } from "@tanstack/react-query";
import { getGroupNotifications } from "@/services/groupNotification";

import { addToast } from "@heroui/react";
import { handleErrorMessage } from "./helpers/errorMessage";

export const useGroupNotifications = (groupId: number) => {

    const query = useQuery({
        queryKey: ["groupNotifications", groupId],
        queryFn: () => getGroupNotifications(groupId),
        refetchOnWindowFocus: false,
    });

    if (query.error) {
        const description = handleErrorMessage(query.error);
        addToast({
            title: "Error al obtener las notificaciones del grupo",
            description,
            color: "danger",
        });
    }
    return query;
};