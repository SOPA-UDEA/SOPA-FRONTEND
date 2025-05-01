'use client';
import CustomDropdown from "@/components/pensum/CustomDropdown"
import { useFetchPensums } from "../hooks/useFetchPensums" 
import {CustomDataGrid} from "@/components/pensum/CustomDataGrid"
import { useFetchSubjetcByPensum } from "../hooks/useFetchSubjetcByPensum"
import { useState } from "react"
import { Pensum } from "../interface/Pensum"

 const  PensumPage = () => {
        
    const {pensums, loading} = useFetchPensums()
    const [selectedPensum, setSelectedPensum] = useState<Pensum | null>(null)
    const {subjects, loadingSubject} = useFetchSubjetcByPensum(selectedPensum?.id || 0)

    if (loading) return <div>Loading...</div> 
    //if (loadingSubject) return <div>Loading Subjects...</div> 
    return (
        <>
            <div>Pensum</div>
            <CustomDropdown
                pensums={pensums}
                selectedPensum={selectedPensum}
                onSelect={setSelectedPensum}
            />
             
             <div className="container mx-auto mt-4">
                <CustomDataGrid data={subjects}/>
            </div>
        </>
    )
} 
export default PensumPage;
