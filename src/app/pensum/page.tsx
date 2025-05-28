'use client';
import CustomDropdown from "@/app/pensum/components/CustomDropdown";
import { CustomDataGrid, ColumnConfig } from "@/components/util/CustomDataGrid";
import { useEffect, useState, useMemo } from "react"; 
import { Pensum } from "../../interface/Pensum"; 
import { usePensums } from "./hooks/usePensums";
import { useSubject } from "../subjects/hooks/useSubject";
import { useAcademicProgram } from "../academic-program/hooks/useAcademicProgram"; 
import { Pagination } from "@heroui/react"; 

const ITEMS_PER_PAGE = 15;

const PensumPage = () => {
  const { pensums, isLoading: loadingPensums } = usePensums();
  const [selectedPensum, setSelectedPensum] = useState<Pensum | null>(null);
  const { subjects, isLoading: loadingSubjects } = useSubject(selectedPensum?.id || 0);
  const { academicPrograms, isLoading: loadingPrograms } = useAcademicProgram(); 

  const [currentPage, setCurrentPage] = useState(1);

  const isLoading = loadingPensums || loadingSubjects || loadingPrograms;

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedPensum]);

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
  
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = enrichedSubjects.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(enrichedSubjects.length / ITEMS_PER_PAGE);

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
        <div
          className="overflow-x-auto shadow-lg rounded-lg border border-neutral-10 dark:border-neutral-500/30"
        >
          {(selectedPensum && currentItems.length > 0) || !selectedPensum || (selectedPensum && loadingSubjects) ? (
            <CustomDataGrid 
              data={currentItems}
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

        {totalPages > 1 && (
          <div className="flex justify-center mt-6 mb-4">
            <Pagination
              total={totalPages}
              initialPage={1}
              page={currentPage}
              onChange={(page) => setCurrentPage(page)}
              color="primary"
            />
          </div>
        )}
      </div>
    </>
  );
};

export default PensumPage;
