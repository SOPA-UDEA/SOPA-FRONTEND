import api from "../db/config";
import { GroupClassroomDrai } from "../interface/GroupClassroom";

export const uploadGroupClassroomDrai = async (data: GroupClassroomDrai): Promise<string> => {
    const formData = new FormData();
    formData.append("semester", data.semester);
    formData.append("pensumId", data.pensumId.toString());
    formData.append("file", data.file);

    const response = await api.post<string>("/group_classroom/upload-excel-drai", formData);

    return response.data;
};

export const updateGroupClassroomDrai = async (data: GroupClassroomDrai): Promise<string> => {
    const formData = new FormData();
    formData.append("semester", data.semester);
    formData.append("pensumId", data.pensumId.toString());
    formData.append("file", data.file);

    const response = await api.post<string>("/group_classroom/update-excel-drai", formData);

    return response.data;
}