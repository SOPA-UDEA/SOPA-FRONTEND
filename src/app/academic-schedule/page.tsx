"use client";

import React, { useEffect, useRef, useState } from 'react'
import { CustomModalForm } from './components/CustomModalForm'
import { Toaster } from 'react-hot-toast';
import { CustomDataGrid } from '@/components/util/CustomDataGrid';
import { useGroups } from '@/hooks/useGroups'; 
import { AcademicScheduleResponse} from '@/interface/AcademicSchedule';
import { useCreateAcademicSchedule } from '@/hooks/useAcademicScheduleCreate';
import { usePensums } from '@/hooks/usePensums';
import { useSubject } from '@/hooks/useSubject';
import { useAcademicProgram } from '@/hooks/useAcademicProgram';
import { Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from '@heroui/react';
import { getAcademicProgramById } from '@/helpers/getAcademicProgramById';
import { AcademicProgram } from '@/interface/AcademicProgram';


const page = () => {

    const createAcademicSchedule = useCreateAcademicSchedule();
    const [academicSchedule, setAcademicSchedule] = useState<AcademicScheduleResponse | null>(null);
    const{groups, isLoading, isError, error} = useGroups(academicSchedule?.id || 0);
    const onCloseRef = useRef<() => void>(() => {});

    const { pensums, isLoading: loadingPensums } = usePensums();
    const { academicPrograms, isLoading: loadingPrograms } = useAcademicProgram();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [program, setProgram] = useState<AcademicProgram | null>(null);
    useEffect(() => {
      if (academicSchedule) {
        onOpen()
      }  
    }, [academicSchedule]);


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
                        Selecciona los pensums a usar
                        </ModalHeader>
                        <ModalBody>
                          <CustomDataGrid data={[]} actions={true} checkbox={true} />
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
