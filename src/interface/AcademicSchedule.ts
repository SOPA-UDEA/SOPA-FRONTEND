export interface AcademicSchedule {
    semester: string;
  }

export interface AcademicScheduleResponse {
  id: number;
  semester: string;
  schedule_pensum_ids: number[]
}

export interface AcademicScheduleRequest {
  semester: string;
  pensumsIds: number[];
}