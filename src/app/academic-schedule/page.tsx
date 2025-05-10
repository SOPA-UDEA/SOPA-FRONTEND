"use client";

import React, { useEffect, useState } from 'react'
import { CustomModalForm } from './components/CustomModalForm'
import { Toaster } from 'react-hot-toast';
import { CustomDataGrid } from '@/components/util/CustomDataGrid';
import { useGroups } from '@/hooks/useGroups'; 
import { AcademicScheduleResponse, AcademicSchedule} from '@/interface/AcademicSchedule';
import { useCreateAcademicSchedule } from '@/hooks/useAcademicScheduleCreate';
const page = () => {
    const createAcademicSchedule = useCreateAcademicSchedule();
    const [academicSchedule, setAcademicSchedule] = useState<AcademicScheduleResponse | null>(null);
    const{groups, isLoading, isError, error} = useGroups(academicSchedule?.id || 0);

    useEffect(() => {
        
    }, [groups , academicSchedule]);

  return (
    <>
        
        <Toaster position="top-right" />
        <div>Academic Program</div>
        <CustomModalForm onCreated={setAcademicSchedule} 
          onSubmitForm={createAcademicSchedule} 
          defaultValues={{semester: ''}} 
        />
        
        <CustomDataGrid data={groups}/>
    </>
  )
}

export default page
