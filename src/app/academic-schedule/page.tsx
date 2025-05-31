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
import CustomDropdownActions from './components/CustomDropdownActions';
import CustomModalUpdate from './components/CustomModalUpdate';
import { GroupRequestUpdate } from '@/interface/Group';


const Page = () => {
    const createAcademicSchedule = useCreateAcademicSchedule();
    const { pensums } = usePensums();
    const { academicPrograms } = useAcademicProgram();
    const createGroup = useCreateGroup()
    const [academicSchedule, setAcademicSchedule] = useState<AcademicScheduleResponse | null>(null);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedPensums, setSelectedPensums] = useState<number[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<GroupRequestUpdate | null>(null);
    const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
    // const groupResponse = useGroupsByScheduleId(academicSchedule?.id || 0);
    const groupResponse = useGroupsByScheduleId(207);
    const [created, setCreated] = useState(Boolean);  
    const { isOpen: isOpenUpdate,  onOpenChange: onOpenChangeUpdate } = useDisclosure();
  
    const handleOpenChangeUpdate = (open: boolean) => {
        if (!open) {
          setSelectedGroup(null);
          setSelectedGroupId(null);
        }
        onOpenChangeUpdate()
    }

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
      const professorNames = group.group_x_professor.map(gxp => gxp.professor.name).join(', ');
      const professorsIds = group.group_x_professor.map(gxp => gxp.professor.id);
      const schedules = group.classroom_x_group.map(cxg => cxg.mainSchedule).join(' | ')
        return {
        professorsN: professorNames,
        professors: professorsIds,
        mirrorGroup: group.mirror_group.name,
        subjectName: group.subject.name,
        subjectCode: group.subject.code, 
        subjectLevel: group.subject.level,
        subjectModality: group.subject.pensum.academic_program.modalityAcademic,
        schedules: schedules,
        baseGroup: group.code === 0 ? 'Grupo base' :group.code,
        ...group,
      };
    });

    useEffect(() => {
      if (selectedGroup && selectedGroupId) {
        onOpenChangeUpdate();
      }
    }, [selectedGroup, selectedGroupId]);

  return (
    <>
        <Toaster position="top-right" />
        <div >
          <h1 className="text-h-2 text-primary-7740 mb-6"> {}
          Programación Académica
          </h1>
        </div>
            {
              !academicSchedule && (
                <CustomModalForm onCreated={setAcademicSchedule} 
                onSubmitForm={createAcademicSchedule} 
                defaultValues={{semester: ''}} 
              />
              )
            }
        
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
          data={[...enrichedGroups].sort((a, b) => a.subjectLevel - b.subjectLevel)}
          checkbox={true}
          columns={[
            { field: 'id', headerName: 'ID'},
            { field: 'mirrorGroup', headerName: 'Código espejo'},
            { field: 'subjectCode', headerName: 'Código materia' },
            { field: 'subjectName', headerName: 'Materia' },
            { field: 'subjectLevel', headerName: 'Nivel'},
            { field: 'subjectModality', headerName: 'Modalidad'},
            { field: 'maxSize', headerName: 'Max. cupos' },
            { field: 'groupSize', headerName: 'Cupos'},
            { field: 'registeredPlaces', headerName: 'Matriculados' },
            { field: 'baseGroup', headerName: 'Numero del grupo'},
            { field: 'aula', headerName: 'Aula'},
            { field: 'schedules', headerName: 'Horario'},
            { field: 'professorsN', headerName: 'Profesores'},
            { field: 'modality', headerName: 'Modalidad grupo'}, 
            { field: 'actions', headerName: 'Acciones', renderActions: (item) => (
              <CustomDropdownActions 
                groupId={item.id} 
                setSelectedGroup={setSelectedGroup} 
                setSelectedGroupId={setSelectedGroupId} 
                group={item} 
              />
            )},           
          ]}
        />}  
            {
              selectedGroup  && selectedGroupId &&(
                <CustomModalUpdate isOpen={isOpenUpdate} onOpenChange={handleOpenChangeUpdate} selectedGroup={selectedGroup} groupId={selectedGroupId}/>
              )
            }
        </div>
    </>
  )
}

export default Page
