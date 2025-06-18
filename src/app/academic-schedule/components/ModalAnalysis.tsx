import { useAcademicProgram } from "@/app/academic-program/hooks/useAcademicProgram";
import { ClockLoader } from "react-spinners";
import { getAcademicProgramById } from "@/helpers/getAcademicProgramById";
import { useCheckCollisions, useCheckMirrorGroup, useCheckCapacity, useCheckScheduleClassroomModified } from "@/hooks/useDataAnalysis";
import { usePensums } from "@/hooks/usePensums";
import {
  Button, Modal, Radio, RadioGroup, ModalContent, ModalBody, ModalFooter, ModalHeader, Input,
} from "@heroui/react";
import { useState } from "react";
import { useExportExcel } from "@/hooks/useGroupClassroom";
import { useQueryClient } from '@tanstack/react-query';

interface Props {
  onOpenChange: (isOpen: boolean) => void;
  isOpen: boolean;
  isCollisionOnly: boolean;
  selectedAnalyses: string[];
  setSelectedAnalyses: (analyses: string[]) => void;
  action: "ANALYSIS" | "EXPORT";
}

export const ModalAnalysis = ({
  onOpenChange,
  isOpen,
  isCollisionOnly,
  selectedAnalyses,
  setSelectedAnalyses,
  action,
}: Props) => {
  const { pensums } = usePensums();
  const { academicPrograms } = useAcademicProgram();
  const [selectedPensums, setSelectedPensums] = useState<number[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<string | null>(null);

  const { mutateAsync: checkCollisions, isPending: isPendingCollisions } = useCheckCollisions();
  const { mutateAsync: checkMirrorGroup, isPending: isPendingMirrorGroups } = useCheckMirrorGroup();
  const { mutateAsync: checkCapacity, isPending: isPendingCapacity } = useCheckCapacity();
  const { mutateAsync: checkScheduleClassroomModified, isPending: isPendingScheduleClassroomModified } = useCheckScheduleClassroomModified();
  const { mutateAsync: exportExcel, isPending: isPendingExport } = useExportExcel();

  const QueryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const semester = e.currentTarget.semester.value;
    const pensumId = selectedPensums[0];

    if (action === "ANALYSIS") {
      for (const analysis of selectedAnalyses) {
        setCurrentAnalysis(analysis);
        if (analysis === "collision") {
          await checkCollisions({ semester });
        } else if (analysis === "mirrorGroup") {
          await checkMirrorGroup({ semester, pensumId });
        } else if (analysis === "capacity") {
          await checkCapacity({ semester, pensumId });
        } else if (analysis === "classroomSchedule") {
          await checkScheduleClassroomModified({ semester, pensumId });
        }
      }
      // Invalidate queries to refresh data after analysis
      QueryClient.invalidateQueries({ queryKey: ['groupNotifications'] });

    } else if (action === "EXPORT") {
      // Handle export logic here if needed
      await exportExcel({ semester, pensumId });
    }
    setCurrentAnalysis(null);
    setSelectedAnalyses([]);
    onOpenChange(false);
  };


  const handleMessage = () => {
    switch (currentAnalysis) {
      case "collision":
        return "Analizando colisiones...";
      case "mirrorGroup":
        return "Analizando grupos espejo...";
      case "capacity":
        return "Analizando capacidad...";
      case "classroomSchedule":
        return "Analizando horarios y aulas...";
      default:
        return "Cargando...";
    }
  };


  const handleIsLoading = () => {
    return isPendingCollisions || isPendingMirrorGroups || isPendingCapacity || isPendingScheduleClassroomModified || isPendingExport;
  }

  return (

    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={() => {
          if (!handleIsLoading()) {
            onOpenChange(!isOpen);
          }
        }}
        className="overflow-y-auto"
      >
        <ModalContent>
          {() => (
            <form onSubmit={handleSubmit}>
              <ModalHeader>
                {isCollisionOnly ? "Ingrese un semestre" : "Seleccione un pensum y semestre"}
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col space-y-4">
                  {!isCollisionOnly && (
                    <RadioGroup
                      isRequired
                      name="pensums"
                      onValueChange={(value) => setSelectedPensums([parseInt(value)])}
                      className="space-y-2"
                    >
                      {pensums.map((pensum) => {
                        const program = getAcademicProgramById(pensum.academicProgramId, academicPrograms);
                        return (
                          <Radio
                            key={pensum.id}
                            value={pensum.id.toString()}
                            className="px-4 py-2 rounded-md hover:bg-green-50"
                          >
                            <span className="text-sm text-gray-700">
                              {program.code} - {program.name} - {program.modalityAcademic} - {pensum.version}
                            </span>
                          </Radio>
                        );
                      })}
                    </RadioGroup>)
                  }
                  <Input
                    name="semester"
                    type="text"
                    label="Semestre"
                    placeholder="Ejemplo: 2023-1"
                    className="w-full"
                    isRequired
                  />
                </div>


              </ModalBody>
              <ModalFooter>
                {!handleIsLoading() && (
                  <>
                    <Button type="submit" color="secondary">{
                      action === "ANALYSIS" ? "Ejecutar análisis" : "Exportar a Excel"
                    }</Button>
                    <Button color="danger" onPress={() => onOpenChange(false)}>
                      Cancelar
                    </Button>
                  </>
                )}
                {handleIsLoading() && (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 p-4 rounded-md bg-gray-50 border border-gray-200 shadow-sm">
                    <ClockLoader size={24} color="#4A5568" />
                    <div className="flex flex-col text-sm">
                      <span className="text-gray-800 font-medium">
                        Cargando... Este proceso puede tardar unos minutos
                      </span>
                      <span className="text-gray-500">{handleMessage()}</span>
                    </div>
                  </div>
                )}

              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal >
    </>
  )
}
