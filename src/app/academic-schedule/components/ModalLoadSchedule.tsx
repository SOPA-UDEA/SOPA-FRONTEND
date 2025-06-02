import { Button, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from "@heroui/react"

export default function ModalLoadSchedule() {
    const {onOpen, isOpen, onOpenChange } = useDisclosure()

    return (
        <section className="mt-6">
            <Button
                onPress={ onOpen }
                color="secondary"    
            >
                Cargar Programacion
            </Button>

            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
            >
            <ModalContent>
                <>
                    <ModalHeader className="flex flex-col gap-1">
                        Cargar programacion académica
                    </ModalHeader>
                    <ModalBody>
                        <Button>Hola</Button>
                    </ModalBody>
                </>
            </ModalContent>
        </Modal>
        </section>
    )
}