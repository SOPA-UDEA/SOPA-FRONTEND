export interface preRequirement{
    id: number;
    code:string
    subjectId: number;
  }
  
export interface Subject {
    id: number;
    level: number;
    fields: JSON;
    code: string;
    credits: number;
    weeklyHours: number;
    weeks: number;
    validable: boolean;
    enableable: boolean;
    preRequirements: JSON;
    coRequirements: JSON;
    creditRequirements: JSON;
    name: string;
    pensumId: number;
    prerequirement: preRequirement[];
  }