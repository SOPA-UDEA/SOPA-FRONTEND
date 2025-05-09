"use client";

import React, { useEffect, useState } from 'react'
import { AcademicProgramForm } from './components/AcademicProgramForm'
import { Toaster } from 'react-hot-toast';
import { CustomDataGrid } from '@/components/util/CustomDataGrid';
import { useGroups } from '@/hooks/useGroups'; 
import { AcademicScheduleResponse} from '@/interface/AcademicSchedule';
import { Button } from '@heroui/react';
const page = () => {

    const [academicSchedule, setAcademicSchedule] = useState<AcademicScheduleResponse | null>(null);
    const{groups, isLoading, isError, error} = useGroups(academicSchedule?.id || 0);

    useEffect(() => {
        
    }, [groups , academicSchedule]);

  return (
    <>
        {academicSchedule && (
          <>
            
            {JSON.stringify(academicSchedule)}
          </>
        )}
        <Toaster position="top-right" />
        <div>Academic Program</div>
        <AcademicProgramForm onCreated={setAcademicSchedule} />
        
        <CustomDataGrid data={groups}/>
    </>
  )
}

export default page
