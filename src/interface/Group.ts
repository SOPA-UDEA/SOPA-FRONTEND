import { Classroom } from "./Classroom";

export interface Group {
    groupSize: number;
    modality: string;
    code: number;
    mirrorGroupId: number;
    subjectId: number;
    academicSchedulePensumId: number;
    maxSize: number;
    registeredPlaces: number;
    };

    export interface Academic {
    pensumId: number,
    academicScheduleId: number
}

export interface Mirror {
    name: string
}
export interface GroupRequest {
    group: Group,
    mirror: Mirror,
    academic: Academic
}

export interface AcademicProgramResponse {
    modalityAcademic: string;
}

export interface PensumResponse {
    academic_program: AcademicProgramResponse;
}
export interface subjectResponse {
    id: number;
    name: string;
    level: number;
    code: string;
    pensum: PensumResponse;
}

export interface ClassroomXGroupResponse {
    id: number;
    mainSchedule: string;
    auxSchedule: string;
    mainClassroom: Classroom;
    auxClassroom: Classroom;
}

export interface ProfessorResponse {
    id: number,
    name: string,
    identification: string
}

export interface GroupXProfessor {
    professor: ProfessorResponse
}

export interface GroupResponse {
    id: number;
    groupSize: number;
    modality: string;
    code: number;
    mirrorGroupId: number;
    subjectId: number;
    academicSchedulePensumId: number;
    mirror_group: Mirror;
    subject: subjectResponse;
    maxSize: number;
    registeredPlaces: number
    classroom_x_group: ClassroomXGroupResponse[]
    group_x_professor: GroupXProfessor[]
    };

export interface GroupRequestUpdate {
    groupSize: number;
    maxSize: number;
    registeredPlaces: number;
    professors: number[];
    modality: string;
}

export interface GetGroupsParams {
  academicScheduleId: number;
  pensumIds: number[];
  skip?: number;
  take?: number;
}

export interface PaginatedGroupResponse {
  total: number;
  limit: number;
  offset: number;
  data: GroupResponse[];
}