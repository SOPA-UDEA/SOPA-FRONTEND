import { useSubjectsByPensumIds } from "@/app/subjects/hooks/useSubjectsByPensumIds";
import { CustomNotification } from "@/components/util/CustomNotification";
import { getAcademicProgramById } from "@/helpers/getAcademicProgramById";
import { AcademicProgram } from "@/interface/AcademicProgram";
import { AcademicScheduleResponse } from "@/interface/AcademicSchedule";
import { Pensum } from "@/interface/Pensum";
import { Button, Checkbox, Form, Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/react";
import { UseMutationResult } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

interface CustomModalGroupsProps <T> {
    onSubmitForm: UseMutationResult<T, unknown, any, unknown>;
    onCreated: () => void;
    pensums: Pensum[];
    academicPrograms: AcademicProgram[];
    academicSchedule: AcademicScheduleResponse;
    isOpen: boolean;
    onOpen: () => void;
    onOpenChange: () => void;
    selectedPensums: number[];
    setSelectedPensums: React.Dispatch<React.SetStateAction<number[]>>;
} 


export const CustomModalGroups = <T,> ({onCreated, onSubmitForm, pensums, academicPrograms, academicSchedule, isOpen, onOpen, onOpenChange, selectedPensums, setSelectedPensums }: CustomModalGroupsProps<T>) => {
    
  const {subjects} = useSubjectsByPensumIds(selectedPensums)
    const onCloseRef = useRef<() => void>(() => {});
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        if (academicSchedule) {
        onOpen()
        }  
    }, [academicSchedule]);

    const handleCheckboxChange = (pensumId: number, checked: boolean) => {
          if (checked) {
            setSelectedPensums((prevSelected) => [...prevSelected, pensumId]);
          } else {
            setSelectedPensums((prevSelected) => prevSelected.filter(id => id !== pensumId));
          }
        };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!academicSchedule) return;

      try {
        subjects.map((subject) => {
          const groupData = {
            group: {
              groupSize: 20,
              modality: "Presencial",
              code: 1,
              mirrorGroupId: 1,
              subjectId: subject.id,
              academicSchedulePensumId: 0,
              maxSize: 20,
              registeredPlaces: 0,
              schedule: 'L-V 8:00-10:00'
            },
            mirror: {
              name: "Grupo espejo A",
            },
            academic: {
              pensumId: subject.pensumId,
              academicScheduleId: academicSchedule.id
            }
          };

          return onSubmitForm.mutateAsync(groupData);
        });

        onCloseRef.current?.();
        onCreated();
        onOpenChange();
        setShowSuccess(true);
      } catch (error) {
        setShowError(true);
        onOpenChange();
      }
    };
    
  return (
    <>
        <CustomNotification message="Grupos creados con éxito" type="success" show={showSuccess} />
        <CustomNotification message="Error al crear los grupos" type="error" show={showError} />
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            >
            <ModalContent>
                {(onClose) => {
                    onCloseRef.current = onClose;
                    return (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                          Seleccionar pensums
                        </ModalHeader>
                        <ModalBody>
                          
                          <Form onSubmit={handleSubmit}>
                              {pensums.map((pensum) => {
                                const program = getAcademicProgramById(pensum.academicProgramId,academicPrograms);
                                return (
                                  <Checkbox 
                                    key={pensum.id} 
                                    defaultChecked={false}
                                    onChange={(e) => handleCheckboxChange(pensum.id, e.target.checked)}
                                  >
                                    {program.code} - {program.name} - {program.modalityAcademic} - {pensum.version}
                                  </Checkbox>
                                );
                              })}
                              <Button type='submit'>Guardar</Button>
                          </Form>    

                        </ModalBody>
                    </>
                    );
                }}
            </ModalContent>
        </Modal>
        </>
  )
}
