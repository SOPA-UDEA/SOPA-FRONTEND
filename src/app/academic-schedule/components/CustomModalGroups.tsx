import { useSubjectsByPensumIds } from "@/app/subjects/hooks/useSubjectsByPensumIds";
import { CustomNotification } from "@/components/util/CustomNotification";
import { getAcademicProgramById } from "@/helpers/getAcademicProgramById";
import { AcademicProgram } from "@/interface/AcademicProgram";
import { AcademicScheduleResponse } from "@/interface/AcademicSchedule";
import { Pensum } from "@/interface/Pensum";
import { Button, Checkbox, Form, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from "@heroui/react";
import { UseMutationResult } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

interface CustomModalGroupsProps <T> {
    onSubmitForm: UseMutationResult<T, unknown, any, unknown>;
    onCreated: (data: any) => void;
    pensums: Pensum[];
    academicPrograms: AcademicProgram[];
    academicSchedule?: AcademicScheduleResponse | null;
} 


export const CustomModalGroups = <T,> ({onCreated, onSubmitForm, pensums, academicPrograms, academicSchedule }: CustomModalGroupsProps<T>) => {
    
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const onCloseRef = useRef<() => void>(() => {});
    const [selectedPensums, setSelectedPensums] = useState<number[]>([]);
    const {subjects, isLoading: isLoadingSubjects } = useSubjectsByPensumIds(selectedPensums)
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

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            
            if (academicSchedule) {
                subjects.forEach((subject) => {
                const groupData = {
                    group: {
                    groupSize: 20,
                    modality: "Presencial",
                    code: 1,
                    mirrorGroupId: 1,
                    subjectId: subject.id,
                    academicSchedulePensumId: 0
                    },
                    mirror: {
                    name: "Grupo espejo A",
                    },
                    academic: {
                    pensumId: subject.pensumId,
                    academicScheduleId: academicSchedule.id
                    }
                }

                onSubmitForm.mutate(
                groupData,
                {
                    onSuccess: (data) => {
                        onCreated(data);
                        onCloseRef.current?.(); 
                        onOpenChange();
                        setShowSuccess(true);
                    },
                    onError: () => {
                        setShowError(true);
                        onOpenChange();
                    }
                }
                )
            })

            }
        }
    
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
