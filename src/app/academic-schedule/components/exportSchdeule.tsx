import { Button, Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/react";
import PesnumSelector from "./pensumsSelector";
import { useState } from "react";

interface Props{
    isOpen: boolean;
    onOpenChange: () => void;
    onOpenSchedule: () => void;
    setPensums: (pensumsId: number[]) => void;
}

export default function ExportSchedule({ isOpen, onOpenChange, onOpenSchedule,  setPensums}: Props) {

    const [action, setAction] = useState('ExportSchedule');

    return(
        <>
            <Button className="mx-2" color="secondary"onPress={onOpenChange}>
                Expotar Programación
            </Button>
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
                                    <PesnumSelector 
                                        setSelectedPensumsIds={setPensums} 
                                        onOpenChange={onOpenChange} 
                                        onOpenSchedule={onOpenSchedule} 
                                        setAction={setAction} 
                                        action={action} 
                                        isFromDrai={true} 
                                        />
                                </ModalBody>
                            </>
                        );
                    }}
                </ModalContent>
            </Modal>
        </>
    )
}