"use client";

import React, { useEffect, useState } from 'react'
import { CustomModalForm } from './components/CustomModalForm'
import { Toaster } from 'react-hot-toast';
import { AcademicScheduleResponse} from '@/interface/AcademicSchedule';
import { useCreateAcademicSchedule } from '@/app/academic-schedule/hooks/useAcademicScheduleCreate';
import { usePensums } from '../pensum/hooks/usePensums';
import { useAcademicProgram } from '../academic-program/hooks/useAcademicProgram';
import { useCreateGroup } from '@/app/groups/hooks/useGroupCreate';
import { Group } from '@/interface/Group';
import { CustomDataGrid } from '@/components/util/CustomDataGrid';
import { CustomModalGroups } from './components/CustomModalGroups';
import { useDisclosure } from '@heroui/react';
import { useSubjectsByPensumIds } from '../subjects/hooks/useSubjectsByPensumIds';

const page = () => {
    const createAcademicSchedule = useCreateAcademicSchedule();
    const { pensums } = usePensums();
    const { academicPrograms } = useAcademicProgram();
    const createGroup = useCreateGroup()
    const [groups, setGroups] = useState<Group[]>([]);
    const [academicSchedule, setAcademicSchedule] = useState<AcademicScheduleResponse | null>(null);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedPensums, setSelectedPensums] = useState<number[]>([]);
    const { subjects } = useSubjectsByPensumIds(selectedPensums);


    useEffect(() => {
      if (academicSchedule) {
        onOpen();
      }
    }, [academicSchedule]);

    const enrichedGroups = groups.map(group => {
    const subject = subjects.find(s => s.id === group.subjectId);
    return {
      subjectName: subject ? subject.name : 'Materia desconocida',
      subjectCode: subject ? subject.code: 'Código materia conocida',
      ...group,
    };
  });

  return (
    <>
        <Toaster position="top-right" />
        <div>Academic Program</div>
            <CustomModalForm onCreated={setAcademicSchedule} 
              onSubmitForm={createAcademicSchedule} 
              defaultValues={{semester: ''}} 
            />
        
        {academicSchedule && 
          <CustomModalGroups 
            onSubmitForm={createGroup}
            onCreated={(data) => {
              setGroups(prev => [...prev, data]);
            }}
            pensums={pensums}
            academicPrograms={academicPrograms}
            isOpen={isOpen}
            onOpen={onOpen}
            onOpenChange={onOpenChange} 
            academicSchedule={academicSchedule}    
            selectedPensums={selectedPensums}
            setSelectedPensums={setSelectedPensums}    
          />
        }
        
        <div className='p-2'>
        {groups.length > 0 && <CustomDataGrid
          data={enrichedGroups}
          checkbox={true}
          actions={true}
          columns={[
            { field: 'subjectName', headerName: 'Materia' },
            { field: 'subjectCode', headerName: 'Código materia' },
            { field: 'modality', headerName: 'Modalidad'},
            { field: 'groupSize', headerName: 'Tamaño del grupo'},
            { field: 'code', headerName: 'Numero del grupo'},
            { field: 'mirrorGrpoupId', headerName: 'Código espejo'},
          ]}
        />}  
        </div>
    </>
  )
}

export default page
