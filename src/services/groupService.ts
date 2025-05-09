import api from "../db/config";
import { AcademicSchedule } from "../interface/AcademicSchedule";

export const getGroups = async (): Promise<AcademicSchedule[]> => {
  const response = await api.get("/group/lists");
  return response.data;
};


export const getGroupByAcdemicSchedulePenusm = async (academicScheduleId: number): Promise<AcademicSchedule[]> => {
    const response = await api.get(`/academic_schedule_pensum/${academicScheduleId}/groups`);
    return response.data;
  };