import api from "../db/config";
import { GroupClassroomDraiUpload } from "../interface/GroupClassroom";

export const uploadGroupClassroomDrai = async (data: GroupClassroomDraiUpload): Promise<string> => {
    const formData = new FormData();
    formData.append("semester", data.semester);
    formData.append("pensumId", data.pensumId.toString());
    formData.append("file", data.file);

    const response = await api.post<string>("/group_classroom/upload-excel-drai", formData);

    return response.data;
};