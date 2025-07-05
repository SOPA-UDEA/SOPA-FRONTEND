import { useGetScheduleToExport } from "@/hooks/useSchedule"
import { Modal, ModalContent, ModalHeader, ModalBody, Radio, Form, Button, RadioGroup } from "@heroui/react";
import { useState } from "react";

interface Props{
    pensumId: number;
    isOpen: boolean;
    onOpenChange: () => void;
    setScheduleId: (s: number) => void;
    onOpenChangeDownload: () => void;
}

export default function ModalSemesterSelector({pensumId, onOpenChange, isOpen, setScheduleId, onOpenChangeDownload}: Props) {

    const {data, isPending} = useGetScheduleToExport( pensumId );
    const [semesterId, setSemesterId] = useState('');

    const handleSumbmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setScheduleId(parseInt(semesterId));
        onOpenChangeDownload();
    }

    return(
         <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
            >
                <ModalContent>
                    {() => {
                        return (
                            <>
                                <ModalHeader className="flex flex-col gap-1">
                                    Selecciona el Pensum
                                </ModalHeader>
                                <ModalBody>
                                    {
                                        isPending && <span>Cargando...</span>
                                    }
                                    <Form
                                        onSubmit={ handleSumbmit }
                                    >
                                        {
                                           <RadioGroup
                                                label="Selecciona el semestre"
                                                value={semesterId}
                                                onChange={(e) => setSemesterId(e.target.value)}
                                            >
                                                {data?.map((semester) => (
                                                    <Radio key={semester.id} value={semester.id.toString()}>
                                                    {semester.semester}
                                                    </Radio>
                                                ))}
                                            </RadioGroup>
                                        }
                                        <Button color="secondary"
                                            type="submit"
                                        >
                                            Seleccionar
                                        </Button>
                                    </Form>
                                </ModalBody>
                            </>
                        );
                    }}
                </ModalContent>
            </Modal>
    )
}