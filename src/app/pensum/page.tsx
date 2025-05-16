'use client';
import CustomDropdown from "@/app/pensum/components/CustomDropdown";
import { CustomDataGrid } from "@/components/util/CustomDataGrid";
import { useState } from "react";
import { Pensum } from "../../interface/Pensum";
import { usePensums } from "./hooks/usePensums";
import { useSubject } from "../subjects/hooks/useSubject";
import { useAcademicProgram } from "../academic-program/hooks/useAcademicProgram"; 

const PensumPage = () => {
  const { pensums, isLoading } = usePensums();
  const [selectedPensum, setSelectedPensum] = useState<Pensum | null>(null);
  const { subjects, isLoading: loadingSubject } = useSubject(selectedPensum?.id || 0);
  const { academicPrograms, isLoading: loadingPrograms } = useAcademicProgram(); 

  if (isLoading || loadingPrograms) return <div>Loading...</div>;

  const enrichedSubjects = subjects.map(subject => {
    return {
      ...subjects,
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
        <CustomDataGrid data={subjects}
        columns={[
            { field: 'name', headerName: 'Nombre' },
            { field: 'level', headerName: 'nivel' },
            { field: 'code', headerName: 'Modalidad'},
            { field: 'credits', headerName: 'créditos'},
            { field: 'preRequirements', headerName: 'Prerrequisitos'},
            { field: 'coRequirements', headerName: 'Correquisitos'},
            { field: 'creditRequirements', headerName: 'Créditos Prerrequisitos'}
          ]}
      />
      </div>
    </>
  );
};

export default PensumPage;