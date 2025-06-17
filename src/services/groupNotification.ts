import { GroupNotification } from "@/interface/GroupNotification";
import api from "../db/config";

export const getGroupNotifications = async (groupId: number): Promise<GroupNotification[]> => {
    try {
        const response = await api.get<GroupNotification[]>(`/group_classroom/message-group-classroom/${groupId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching group notifications:", error);
        throw error; // Re-throw the error for further handling if needed
    }
} 