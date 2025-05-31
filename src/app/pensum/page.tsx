'use client';
import CustomDropdown from "@/app/pensum/components/CustomDropdown";
import { CustomDataGrid, ColumnConfig } from "@/components/util/CustomDataGrid";
import { useState, useMemo } from "react"; 
import { Pensum } from "../../interface/Pensum"; 
import { usePensums } from "./hooks/usePensums";
import { useSubject } from "../subjects/hooks/useSubject";
import { useAcademicProgram } from "../academic-program/hooks/useAcademicProgram"; 



const PensumPage = () => {
  const { pensums, isLoading: loadingPensums } = usePensums();
  const [selectedPensum, setSelectedPensum] = useState<Pensum | null>(null);
  const { subjects, isLoading: loadingSubjects } = useSubject(selectedPensum?.id || 0);
  const { academicPrograms, isLoading: loadingPrograms } = useAcademicProgram(); 

  

  const isLoading = loadingPensums || loadingSubjects || loadingPrograms;



  const enrichedSubjects = useMemo(() => {
    return subjects.map(subject => {
      const pensum = pensums.find(program => program.id === subject.pensumId);
      const academicProgram = academicPrograms.find(program => program.id === pensum?.academicProgramId);
      let prerequisites: string[] = [];
      if (subject && subject.prerequirement) {
        prerequisites = subject.prerequirement.map(prereq => prereq.code);
      }
      return {
        preRequirementsV: prerequisites.join(', ') || '-',
        validableV: subject.validable ? 'Sí' : 'No',
        enableableV: subject.enableable ? 'Sí' : 'No',
        creditRequirementsV: subject.creditRequirements ? subject.creditRequirements: '-',
        version: pensum ? pensum.version : 'Pensum desconocido',
        modality: academicProgram ? academicProgram.modalityAcademic : 'Modalidad desconocida',
        ...subject,
      };
    });
  }, [subjects, pensums, academicPrograms]);
  
  const columnsDefinition: ColumnConfig[] = [
    { field: 'code', headerName: 'Código' },
    { field: 'name', headerName: 'Materia' },
    { field: 'credits', headerName: 'Créditos'},
    { field: 'level', headerName: 'Nivel' },
    { field: 'modality', headerName: 'Modalidad Programa'},
    { field: 'weeklyHours', headerName: 'Horas / Semana'},
    { field: 'enableableV', headerName: 'Habilitable'},
    { field: 'validableV', headerName: 'Validable'},
    { field: 'preRequirementsV', headerName: 'Prerrequisitos'},
    { field: 'coRequirements', headerName: 'Correquisitos'},
    { field: 'creditRequirementsV', headerName: 'Créd. Prerrequisitos'}
  ];

  if (isLoading) return <div className="flex justify-center items-center min-h-[200px]"><p>Cargando...</p></div>;

  return (
    <>
      <div className="py-2">
        <h1 className="text-h-2 text-primary-7740 mb-6">
          Pensum Académico
        </h1>
      </div>
      <CustomDropdown
        pensums={pensums}
        selectedPensum={selectedPensum}
        onSelect={setSelectedPensum}
        academicPrograms={academicPrograms} 
      />

      <div className="mt-6">
        
          {(selectedPensum && enrichedSubjects.length > 0) || !selectedPensum || (selectedPensum && loadingSubjects) ? (
            <CustomDataGrid 
              data={enrichedSubjects.sort((a, b) => a.level - b.level)}
              columns={columnsDefinition}
              ariaLabel="Detalle del Pensum Académico"
              tableClassName="min-w-[1600px] lg:min-w-[1200px]"
              
            />
          ) : (
            !isLoading && selectedPensum && (
              <div className="p-10 text-center text-neutral-500">
                No hay asignaturas para mostrar para el pensum seleccionado.
              </div>
            )
          )}
      </div>
    </>
  );
};

export default PensumPage;
