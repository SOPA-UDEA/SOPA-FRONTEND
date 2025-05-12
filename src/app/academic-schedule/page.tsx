"use client";

import React, { useEffect, useRef, useState } from 'react'
import { CustomModalForm } from './components/CustomModalForm'
import { Toaster } from 'react-hot-toast';
import { AcademicScheduleResponse} from '@/interface/AcademicSchedule';
import { useCreateAcademicSchedule } from '@/app/academic-schedule/hooks/useAcademicScheduleCreate';
import { usePensums } from '../pensum/hooks/usePensums';
import { useAcademicProgram } from '../academic-program/hooks/useAcademicProgram';
import { Button, Checkbox, Form, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from '@heroui/react';
import { getAcademicProgramById } from '@/helpers/getAcademicProgramById';
import { useCreateGroup } from '@/app/groups/hooks/useGroupCreate';
import { useSubjectsByPensumIds } from '../subjects/hooks/useSubjectsByPensumIds';
import { Group, GroupResponse } from '@/interface/Group';
import { CustomNotification } from '@/components/util/CustomNotification';
import { CustomDataGrid } from '@/components/util/CustomDataGrid';

const page = () => {
    const [selectedPensums, setSelectedPensums] = useState<number[]>([]);
    const {subjects, isLoading: isLoadingSubjects } = useSubjectsByPensumIds(selectedPensums)
    const createAcademicSchedule = useCreateAcademicSchedule();
    const [academicSchedule, setAcademicSchedule] = useState<AcademicScheduleResponse | null>(null);
    const onCloseRef = useRef<() => void>(() => {});
    const { pensums } = usePensums();
    const { academicPrograms } = useAcademicProgram();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { mutate } = useCreateGroup()
    const [groups, setGroups] = useState<Group[]>([]);
   
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);

    const handleCheckboxChange = (pensumId: number, checked: boolean) => {
      if (checked) {
        setSelectedPensums((prevSelected) => [...prevSelected, pensumId]);
      } else {
        setSelectedPensums((prevSelected) => prevSelected.filter(id => id !== pensumId));
      }
    };

    useEffect(() => {
      if (academicSchedule) {
        onOpen()
      }  
    }, [academicSchedule]);

    useEffect(() => {
        console.log(groups);
    }, [groups]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      console.log(subjects);
      
      if (academicSchedule) {
          subjects.map((subject) => {
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

          setGroups((prevSelectd) => [...prevSelectd, groupData.group])
          mutate(
            groupData,
            {
              onSuccess: (data) => {
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
        <Toaster position="top-right" />
        <CustomNotification message="Grupos creados con éxito" type="success" show={showSuccess} />
        <CustomNotification message="Error al crear los grupos" type="error" show={showError} />
        <div>Academic Program</div>
            <CustomModalForm onCreated={setAcademicSchedule} 
              onSubmitForm={createAcademicSchedule} 
              defaultValues={{semester: ''}} 
            />
        
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
        <div className='p-2'>
        <CustomDataGrid data={groups} checkbox={true} actions={true} />
        </div>
    </>
  )
}

export default page
