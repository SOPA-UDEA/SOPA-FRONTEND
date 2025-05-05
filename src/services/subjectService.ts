import api from "./index";
import { Subject } from "../interface/Subject";

export const getSubjectByPensum = async (id:number): Promise<Subject[]> => {
  const response = await api.get(`http://127.0.0.1:8000/subject/by_pensum/${id}`);
  return response.data.subjects;
};

// export const getSubjectById = async (id:number): Promise<Subject> => {
//   const response = await api.get(`/subject/${id}`);
//   return response.data.subject;
// }; 
