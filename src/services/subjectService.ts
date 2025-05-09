import api from "../db/config";
import { Subject } from "../interface/Subject";

export const getSubjectByPensum = async (id:number): Promise<Subject[]> => {
  const response = await api.get(`/subject/by_pensum/${id}`);
  return response.data;
};

// export const getSubjectById = async (id:number): Promise<Subject> => {
//   const response = await api.get(`/subject/${id}`);
//   return response.data.subject;
// }; 
