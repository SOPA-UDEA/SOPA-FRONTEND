import { useAcademicProgram } from "@/app/academic-program/hooks/useAcademicProgram";
import { usePensums } from "@/hooks/usePensums";
import { getAcademicProgramById } from "@/helpers/getAcademicProgramById";
import { Button, Checkbox, Form } from "@heroui/react";
import { useState } from "react";

interface Props{
    setSelectedPensumsIds: (pensumsId: number[]) => void;
    onOpenChange: (isOpen: boolean) => void;
    onOpenSchedule: () => void;
}

export default function PesnumSelector ({ setSelectedPensumsIds, onOpenChange, onOpenSchedule }: Props) {

    const { pensums } = usePensums();
    const { academicPrograms, isLoading } = useAcademicProgram();
    const [ selectedPensums, setSelectedPensums ] = useState<number[]>([]);
    
    const handleCheckboxChange = (pensumId: number, checked: boolean) => {
        if (checked) {
          setSelectedPensums((prevSelected) => [...prevSelected, pensumId]);
        } else {
          setSelectedPensums((prevSelected) => prevSelected.filter(id => id !== pensumId));
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSelectedPensumsIds(selectedPensums);
        onOpenChange(false);
        onOpenSchedule();
    }

    if (isLoading) return(<>Loading...</>)

    return(
        <Form onSubmit={ handleSubmit }>
            {
                pensums.map(( pensum ) => {
                    const program = getAcademicProgramById(pensum.academicProgramId, academicPrograms);
                    return (
                        <Checkbox 
                            key={pensum.id} 
                            defaultChecked={false}
                            onChange={(e) => handleCheckboxChange(pensum.id, e.target.checked)}
                        >
                            {program.code} - {program.name} - {program.modalityAcademic} - {pensum.version}
                        </Checkbox>
                    );
                })
            }
            <Button type='submit'>Guardar</Button>
        </Form>    
    )
} 