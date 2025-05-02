import { AcademicProgram } from "../interface/AcademicProgram";

export const getAcademicProgramById = (id:number, academicPrograms: AcademicProgram[]) => {
    const program = academicPrograms.find((program) => program.id === id);

    if (!program) {
      throw new Error(`Programa académico con id ${id} no encontrado.`);
    }
  
    return program;
}
