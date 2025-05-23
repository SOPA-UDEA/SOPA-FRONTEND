"use client";

import React, { useEffect, useState } from 'react'
import { CustomModalForm } from './components/CustomModalForm'
import { Toaster } from 'react-hot-toast';
import { AcademicScheduleResponse} from '@/interface/AcademicSchedule';
import { useCreateAcademicSchedule } from '@/app/academic-schedule/hooks/useAcademicScheduleCreate';
import { usePensums } from '../pensum/hooks/usePensums';
import { useAcademicProgram } from '../academic-program/hooks/useAcademicProgram';
import { useCreateGroup } from '@/app/groups/hooks/useGroupCreate';
import { CustomDataGrid } from '@/components/util/CustomDataGrid';
import { CustomModalGroups } from './components/CustomModalGroups';
import { useDisclosure } from '@heroui/react';
import { useGroupsByScheduleId } from '../groups/hooks/useGroups';


const Page = () => {
    const createAcademicSchedule = useCreateAcademicSchedule();
    const { pensums } = usePensums();
    const { academicPrograms } = useAcademicProgram();
    const createGroup = useCreateGroup()
    const [academicSchedule, setAcademicSchedule] = useState<AcademicScheduleResponse | null>(null);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedPensums, setSelectedPensums] = useState<number[]>([]);
    const groupResponse = useGroupsByScheduleId(academicSchedule?.id || 0);
    // const groupResponse = useGroupsByScheduleId(1);
    const [created, setCreated] = useState(Boolean);

    const onCreated = () => {
       setCreated(true);
    }

    useEffect(() => {
      if (academicSchedule) {
        onOpen();
      }
    }, [academicSchedule]);

    useEffect(() => {
    }, [created]);

    const enrichedGroups = groupResponse.groups.map(group => {
        return {
        mirrorGroup: group.mirror_group.name,
        subjectName: group.subject.name,
        subjectCode: group.subject.code, 
        subjectLevel: group.subject.level,
        subjectModality: group.subject.pensum.academic_program.modalityAcademic,
        lunes: group.classroom_x_group && group.classroom_x_group.length > 0 
          ? group.classroom_x_group[0].mainSchedule : '',
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
          pensums={pensums}
          academicPrograms={academicPrograms}
          isOpen={isOpen}
          onOpen={onOpen}
          onOpenChange={onOpenChange}
          academicSchedule={academicSchedule}
          selectedPensums={selectedPensums}
          setSelectedPensums={setSelectedPensums} 
          onCreated={onCreated}
          />
        }
        <div className='p-2'>
        {groupResponse.isLoading && <div>Cargando...</div>}
        {groupResponse.groups.length > 0 && <CustomDataGrid
          data={enrichedGroups}
          checkbox={true}
          actions={true}
          columns={[
            { field: 'mirrorGroup', headerName: 'Código espejo'},
            { field: 'subjectModality', headerName: 'Modalidad'},
            { field: 'subjectCode', headerName: 'Código materia' },
            { field: 'subjectName', headerName: 'Materia Materia' },
            { field: 'maxSize', headerName: 'Max. cupos' },
            { field: 'groupSize', headerName: 'Cupos'},
            { field: 'registeredPlaces', headerName: 'Matriculados' },
            { field: 'code', headerName: 'Numero del grupo'},
            { field: 'aula', headerName: 'Aula'},
            { field: 'lunes', headerName: 'Lunes'},
            { field: 'martes', headerName: 'Martes'},
            { field: 'miercoles', headerName: 'Miercoles'},
            { field: 'jueves', headerName: 'Jueves'},
            { field: 'viernes', headerName: 'Viernes'},
            { field: 'sabado', headerName: 'Sabado'},
            { field: 'profesores', headerName: 'Profesores'},
            { field: 'modality', headerName: 'Modalidad grupo'},
            { field: 'subjectLevel', headerName: 'Nivel'},
          ]}
        />}  
        </div>
    </>
  )
}

export default Page
