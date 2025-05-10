"use client";

import React, { useEffect, useRef, useState } from 'react'
import { CustomModalForm } from './components/CustomModalForm'
import { Toaster } from 'react-hot-toast';
import { CustomDataGrid } from '@/components/util/CustomDataGrid';
import { AcademicScheduleResponse} from '@/interface/AcademicSchedule';
import { useCreateAcademicSchedule } from '@/hooks/useAcademicScheduleCreate';
import { usePensums } from '@/hooks/usePensums';
import { useSubject } from '@/hooks/useSubject';
import { useAcademicProgram } from '@/hooks/useAcademicProgram';
import { Button, Checkbox, Form, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from '@heroui/react';
import { getAcademicProgramById } from '@/helpers/getAcademicProgramById';
import { AcademicProgram } from '@/interface/AcademicProgram';
import { useCreateGroup } from '@/hooks/useGroupCreate';
import { useForm } from '@/hooks/useForm';
import { Subject } from '@/interface/Subject';


const page = () => {

    const createAcademicSchedule = useCreateAcademicSchedule();
    const [academicSchedule, setAcademicSchedule] = useState<AcademicScheduleResponse | null>(null);
    const onCloseRef = useRef<() => void>(() => {});
    const { pensums, isLoading: loadingPensums } = usePensums();
    const { academicPrograms, isLoading: loadingPrograms } = useAcademicProgram();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const createGroup = useCreateGroup();
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const { subjects: subjectsByPensum } = useSubject(0)

    useEffect(() => {
      if (academicSchedule) {
        onOpen()
      }  
    }, [academicSchedule]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      
      setSubjects([]); 


    }


  return (
    <>
        <Toaster position="top-right" />
        <div>Academic Program</div>
        <div className="flex-row row-columns-2">
          <div className="flex-1">
            <CustomModalForm onCreated={setAcademicSchedule} 
              onSubmitForm={createAcademicSchedule} 
              defaultValues={{semester: ''}} 
            />
          </div>        
        
          <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            >
            <ModalContent>
                {(onClose) => {
                    return (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                          Seleccionar pensums
                        </ModalHeader>
                        <ModalBody>
                          <Form>
                              {pensums.map((pensum) => {
                                const program = getAcademicProgramById(pensum.academicProgramId,academicPrograms);
                                return (
                                  <Checkbox key={pensum.id} defaultChecked={false}>
                                    {program.code} - {program.name} - {program.modalityAcademic} - {pensum.version}
                                  </Checkbox>
                                );
                              })}
                              <Button>Guardar</Button>
                          </Form>                          
                        </ModalBody>
                    </>
                    );
                }}
            </ModalContent>
        </Modal>
        </div>
        {/* <CustomDataGrid data={groups}/> */}
    </>
  )
}

export default page
