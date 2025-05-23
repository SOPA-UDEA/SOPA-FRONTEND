'use client';
import CustomDropdown from "@/app/pensum/components/CustomDropdown";
import { CustomDataGrid } from "@/components/util/CustomDataGrid";
import { useEffect, useState } from "react";
import { Pensum } from "../../interface/Pensum";
import { usePensums } from "./hooks/usePensums";
import { useSubject } from "../subjects/hooks/useSubject";
import { useAcademicProgram } from "../academic-program/hooks/useAcademicProgram"; 

const PensumPage = () => {
  const { pensums, isLoading } = usePensums();
  const [selectedPensum, setSelectedPensum] = useState<Pensum | null>(null);
  const { subjects } = useSubject(selectedPensum?.id || 0);
  const { academicPrograms, isLoading: loadingPrograms } = useAcademicProgram(); 

  useEffect(() => {
  }, [selectedPensum]);

  if (isLoading || loadingPrograms) return <div>Loading...</div>;

  const enrichedSubjects = subjects.map(subject => {
    const pensum = pensums.find(program => program.id === subject.pensumId);
    const academicProgram = academicPrograms.find(program => program.id === pensum?.academicProgramId);
    let prerequisites: string[] = [];
    console.log(subject.prerequirement);
    
    if (subject && subject.prerequirement) {
      
      prerequisites = subject.prerequirement.map(prereq => prereq.code);
    }
    return {
      preRequirementsV: prerequisites.join(', '),
      validableV: subject.enableable ? 'Si' : 'No',
      enableableV: subject.validable ? 'Si' : 'No',
      creditRequirementsV: subject.creditRequirements ? subject.creditRequirements: '',
      version: pensum ? pensum.version : 'Pensum desconocido',
      modality: academicProgram ? academicProgram.modalityAcademic : 'Modalidad desconocida',
      ...subject,
    };
  });

  return (
    <>
      <div>Pensum</div>
      <CustomDropdown
        pensums={pensums}
        selectedPensum={selectedPensum}
        onSelect={setSelectedPensum}
        academicPrograms={academicPrograms} 
      />

      <div className="container mx-auto mt-4 pl-1">
        <CustomDataGrid data={enrichedSubjects}
        columns={[
            { field: 'code', headerName: 'Código' },
            { field: 'name', headerName: 'Nombre' },
            { field: 'credits', headerName: 'créditos'},
            { field: 'level', headerName: 'nivel' },
            { field: 'modality', headerName: 'Modalidad Programa'},
            { field: 'weeklyHours', headerName: 'Horas / semana'},
            { field: 'enableableV', headerName: 'Habilitable'},
            { field: 'validableV', headerName: 'Validable'},
            { field: 'preRequirementsV', headerName: 'Prerrequisitos'},
            { field: 'coRequirements', headerName: 'Correquisitos'},
            { field: 'creditRequirementsV', headerName: 'Créditos Prerrequisitos'}
          ]}
      />
      </div>
    </>
  );
};

export default PensumPage;