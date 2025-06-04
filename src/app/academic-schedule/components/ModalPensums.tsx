// import { CustomNotification } from "@/components/util/CustomNotification";
import { Button, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from "@heroui/react";
import PesnumSelector from "./pensumsSelector";
interface Props {
    setPensums: (pensumsId: number[]) => void;
    text: string;
    onOpenSchedule: () => void;
    setAction: (a: string) => void;
    action: string
} 

export const ModalPensums = ({ setPensums, action, onOpenSchedule, text, setAction }: Props) => {
    
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

  return (
    <>
        <Button
            color="secondary"
           onPress={() => {onOpen()}}
        > 
            { text }
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
                          Selecciona los Pensums
                        </ModalHeader>
                        <ModalBody>
                            <PesnumSelector 
                                    setSelectedPensumsIds={setPensums}
                                    onOpenChange={onOpenChange}
                                    onOpenSchedule={onOpenSchedule} 
                                    setAction={ setAction } 
                                    action={ action }                                
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
