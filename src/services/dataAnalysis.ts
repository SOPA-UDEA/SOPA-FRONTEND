import { CollisionRequest, AnalysisRequest } from "@/interface/DataAnalysis";
import api from "../db/config";

export const checkCollisions = async (data: CollisionRequest): Promise<string> => {
    const response = await api.post("/group_classroom/collision", data);
    return response.data;
}

export const checkScheduleClassroomModified = async (data: AnalysisRequest): Promise<string> => {
    const formData = new FormData();
    formData.append("semester", data.semester);
    formData.append("pensumId", data.pensumId.toString());
    const response = await api.post("/group_classroom/check-schedule-classroom-modified", formData);
    return response.data;
}

export const checkCapacity = async (data: AnalysisRequest): Promise<string> => {
    const formData = new FormData();
    formData.append("semester", data.semester);
    formData.append("pensumId", data.pensumId.toString());
    const response = await api.post("/group_classroom/check-capacity", formData);
    return response.data;
}

export const checkMirrorGroup = async (data: AnalysisRequest): Promise<string> => {
    const formData = new FormData();
    formData.append("semester", data.semester);
    formData.append("pensumId", data.pensumId.toString());
    const response = await api.post("/group_classroom/check-mirror-group", formData);
    return response.data;
}