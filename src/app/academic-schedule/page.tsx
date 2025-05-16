"use client";

import React, { useEffect, useRef, useState } from 'react'
import { CustomModalForm } from './components/CustomModalForm'
import { Toaster } from 'react-hot-toast';
import { AcademicScheduleResponse} from '@/interface/AcademicSchedule';
import { useCreateAcademicSchedule } from '@/app/academic-schedule/hooks/useAcademicScheduleCreate';
import { usePensums } from '../pensum/hooks/usePensums';
import { useAcademicProgram } from '../academic-program/hooks/useAcademicProgram';
import { useCreateGroup } from '@/app/groups/hooks/useGroupCreate';
import { Group, GroupResponse } from '@/interface/Group';
import { CustomDataGrid } from '@/components/util/CustomDataGrid';
import { createGroup } from '@/services/groupService';
import { CustomModalGroups } from './components/CustomModalGroups';

const page = () => {
    const createAcademicSchedule = useCreateAcademicSchedule();
    const { pensums } = usePensums();
    const { academicPrograms } = useAcademicProgram();
    const createGroup = useCreateGroup()
    const [groups, setGroups] = useState<Group[]>([]);
    const [group, setGroup] = useState<Group>();
    const [academicSchedule, setAcademicSchedule] = useState<AcademicScheduleResponse | null>(null);
       

    useEffect(() => {
      setGroups((prevGroups) => [...prevGroups, group!]);
    }, [group]);



  return (
    <>
        <Toaster position="top-right" />
        <div>Academic Program</div>
            <CustomModalForm onCreated={setAcademicSchedule} 
              onSubmitForm={createAcademicSchedule} 
              defaultValues={{semester: ''}} 
            />
        
        <CustomModalGroups onSubmitForm={createGroup} onCreated={setGroup} pensums={pensums} academicPrograms={academicPrograms}/>
        
        <div className='p-2'>
        {groups.length > 0 && <CustomDataGrid data={groups} checkbox={true} actions={true} />}  
        </div>
    </>
  )
}

export default page
