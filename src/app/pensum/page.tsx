'use client';
import CustomDropdown from "@/components/util/CustomDropdown"
import {CustomDataGrid} from "@/components/util/CustomDataGrid"
import { useState } from "react"
import {Pensum} from "../../interface/Pensum"
import {usePensums} from "../../hooks/usePensums"
import { useSubject } from "@/hooks/useSubject";


 const  PensumPage = () => {
        
    const {pensums, isLoading} = usePensums()
    const [selectedPensum, setSelectedPensum] = useState<Pensum | null>(null)
    const {subjects, isLoading: loadingSubject} = useSubject(selectedPensum?.id || 0)

    if (isLoading) return <div>Loading...</div> 
    return (
        <>
            <div>Pensum</div>
            <CustomDropdown
                pensums={pensums}
                selectedPensum={selectedPensum}
                onSelect={setSelectedPensum}
            />
             
             <div className="container mx-auto mt-4 pl-1">
                <CustomDataGrid data={subjects}/>
            </div>
        </>
    )
} 
export default PensumPage;
