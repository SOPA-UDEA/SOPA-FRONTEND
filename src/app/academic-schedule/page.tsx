"use client";

import React, { useEffect, useState } from 'react'
import { CustomModalForm } from './components/CustomModalForm'
import { Toaster } from 'react-hot-toast';
import { CustomDataGrid } from '@/components/util/CustomDataGrid';
import { useGroups } from '@/hooks/useGroups'; 
import { AcademicScheduleResponse, AcademicSchedule} from '@/interface/AcademicSchedule';
import { useCreateAcademicSchedule } from '@/hooks/useAcademicScheduleCreate';
import { CustomDropdownAcademicSchedule } from './components/CustomDropdownAcademicSchedule';
import { usePensums } from '@/hooks/usePensums';
import { Pensum } from '@/interface/Pensum';
import { useSubject } from '@/hooks/useSubject';
import { useAcademicProgram } from '@/hooks/useAcademicProgram';


const page = () => {

    const createAcademicSchedule = useCreateAcademicSchedule();
    const [academicSchedule, setAcademicSchedule] = useState<AcademicScheduleResponse | null>(null);
    const{groups, isLoading, isError, error} = useGroups(academicSchedule?.id || 0);
    const [isAcademicSchedule, setIsAcademicSchedule] = useState(false);

    const { pensums, isLoading: loadingPensums } = usePensums();
    const [selectedPensum, setSelectedPensum] = useState<Pensum[] | null>(null);
    // const { subjects, isLoading: loadingSubject } = useSubject(selectedPensum?.id || 0);
    const { academicPrograms, isLoading: loadingPrograms } = useAcademicProgram();


    useEffect(() => {
        
    }, [groups , academicSchedule]);

    

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
        
          <div className="flex-2">
            <CustomDropdownAcademicSchedule
            pensums={pensums}
            selectedPensum={selectedPensum}
            onSelect={setSelectedPensum}
            academicPrograms={academicPrograms}          
              />
          </div>
        </div>
        <CustomDataGrid data={groups}/>
    </>
  )
}

export default page
