import { AcademicSchedule } from "./AcademicSchedule";

export interface Group {
    groupSize: number;
    modality: string;
    code: number;
    mirrorGroupId: number;
    subjectId: number;
    academicSchedulePensumId: number;
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

export interface GroupResponse {
    id: number;
    groupSize: number;
    modality: string;
    code: number;
    mirrorGroupId: number;
    subjectId: number;
    academicSchedulePensumId: number;
    };