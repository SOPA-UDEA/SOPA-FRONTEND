// import { CustomNotification } from "@/components/util/CustomNotification";
import { Button, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from "@heroui/react";
import PesnumSelector from "./pensumsSelector";
interface Props {
    setPensums: (pensumsId: number[]) => void;
    action: string;
    onOpenSchedule: () => void;
} 

export const CustomModalGroups = ({ setPensums, action, onOpenSchedule }: Props) => {
    
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

  return (
    <>
        <Button
            color="secondary"
           onPress={() => {onOpen()}}
        > 
            { action }
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
                          Selecciona los Pensums de la programación
                        </ModalHeader>
                        <ModalBody>
                            <PesnumSelector 
                                setSelectedPensumsIds={setPensums} 
                                onOpenChange={ onOpenChange }
                                onOpenSchedule={ onOpenSchedule }
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
