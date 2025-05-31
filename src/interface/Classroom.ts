export interface Classroom {
    id: number; // Unique identifier for the classroom
    capacity: number; // Maximum number of students in the classroom (must be > 0)
    location: string; // Location of the classroom (max length 255)
    ownDepartment: boolean; // Indicates if the classroom is owned by the department
    virtualMode: boolean; // Indicates if the classroom is virtual
    enabled: boolean; // Indicates if the classroom is enabled
    hasClass: boolean; // Indicates if the classroom has a "SALA" 
}